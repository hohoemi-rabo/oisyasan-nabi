import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isFresh } from '@/src/lib/cache';
import { supabase } from '@/src/lib/supabase';
import type { TransportService } from '@/src/types/transport';

// 交通サービスを AsyncStorage に 24h キャッシュ（ticket 15）。

type TransportServicesState = {
  data: TransportService[];
  loadedAt: number | null;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
  load: (force?: boolean) => Promise<void>;
  setHasHydrated: (b: boolean) => void;
};

export const useTransportServicesStore = create<TransportServicesState>()(
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
            .from('transport_services')
            .select('*')
            .eq('is_active', true)
            .order('name');
          if (error) throw error;
          set({
            data: (data ?? []) as unknown as TransportService[],
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
      name: 'oishasan-navi:transport-cache',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ data: state.data, loadedAt: state.loadedAt }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
