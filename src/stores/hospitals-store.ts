import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isFresh } from '@/src/lib/cache';
import { supabase } from '@/src/lib/supabase';
import type { Hospital } from '@/src/types/hospital';

// 病院マスタ + 診療時間（JOIN）を AsyncStorage に 24h キャッシュ（ticket 15）。

type HospitalsState = {
  data: Hospital[];
  loadedAt: number | null;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
  load: (force?: boolean) => Promise<void>;
  setHasHydrated: (b: boolean) => void;
};

const HOSPITALS_SELECT = `
  id, name, category, address, tel, city,
  opening_hours, google_map_url, website, note,
  latitude, longitude,
  online_consultation, online_consultation_url,
  parking, parking_capacity,
  barrier_free, emergency_available,
  shuttle_bus, shuttle_bus_info,
  schedules:hospital_schedules(
    id, hospital_id, day_of_week,
    morning_start, morning_end, afternoon_start, afternoon_end,
    is_closed, note
  )
`;

export const useHospitalsStore = create<HospitalsState>()(
  persist(
    (set, get) => ({
      data: [],
      loadedAt: null,
      isLoading: false,
      error: null,
      hasHydrated: false,
      load: async (force = false) => {
        const { isLoading, loadedAt, hasHydrated } = get();
        // キャッシュ復元前はネットワークしない（オフライン優先）。鮮度内なら再取得しない。
        if (!hasHydrated || isLoading) return;
        if (!force && isFresh(loadedAt)) return;
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('hospitals')
            .select(HOSPITALS_SELECT)
            .order('name');
          if (error) throw error;
          set({
            data: (data ?? []) as unknown as Hospital[],
            loadedAt: Date.now(),
            isLoading: false,
          });
        } catch (e) {
          // 失敗時はキャッシュを使い続け、error だけ立てる（サイレント）。
          const message = e instanceof Error ? e.message : '不明なエラー';
          set({ error: message, isLoading: false });
        }
      },
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'oishasan-navi:hospitals-cache',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ data: state.data, loadedAt: state.loadedAt }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
