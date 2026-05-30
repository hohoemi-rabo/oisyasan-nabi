import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths, format, subMonths } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isFresh } from '@/src/lib/cache';
import { supabase } from '@/src/lib/supabase';
import type { EmergencyRotation } from '@/src/types/emergency';

// 救急ローテを AsyncStorage に 24h キャッシュ（ticket 15）。前月+当月+次月分のみ取得。

type EmergencyRotationsState = {
  data: EmergencyRotation[];
  loadedAt: number | null;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
  load: (force?: boolean) => Promise<void>;
  setHasHydrated: (b: boolean) => void;
};

function sourceMonths(at: Date = new Date()): string[] {
  return [subMonths(at, 1), at, addMonths(at, 1)].map((d) => format(d, 'yyyy-MM'));
}

export const useEmergencyRotationsStore = create<EmergencyRotationsState>()(
  persist(
    (set, get) => ({
      data: [],
      loadedAt: null,
      isLoading: false,
      error: null,
      hasHydrated: false,
      load: async (force = false) => {
        const { isLoading, loadedAt, hasHydrated } = get();
        if (!hasHydrated || isLoading) return;
        if (!force && isFresh(loadedAt)) return;
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('emergency_rotations')
            .select('*')
            .in('source_month', sourceMonths())
            .order('duty_date')
            .order('start_time');
          if (error) throw error;
          set({
            data: (data ?? []) as unknown as EmergencyRotation[],
            loadedAt: Date.now(),
            isLoading: false,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : '不明なエラー';
          set({ error: message, isLoading: false });
        }
      },
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'oishasan-navi:emergency-rotations-cache',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ data: state.data, loadedAt: state.loadedAt }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
