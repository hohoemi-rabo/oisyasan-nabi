import { create } from 'zustand';

import { supabase } from '@/src/lib/supabase';
import type { EmergencyRotation } from '@/src/types/emergency';

// Same memory-resident shape as hospitals-store / transport-services-store.
// ticket 15 will wrap this with persist + 24h TTL (cache key
// `oishasan-navi:emergency-rotations-cache`). Table is small (~tens of rows),
// so we load everything and filter by date client-side.

type EmergencyRotationsState = {
  data: EmergencyRotation[];
  loadedAt: number | null;
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
};

export const useEmergencyRotationsStore = create<EmergencyRotationsState>()((set) => ({
  data: [],
  loadedAt: null,
  isLoading: false,
  error: null,
  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('emergency_rotations')
        .select('*')
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
}));
