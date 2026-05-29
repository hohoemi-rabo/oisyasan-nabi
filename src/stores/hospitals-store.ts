import { create } from 'zustand';

import { supabase } from '@/src/lib/supabase';
import type { Hospital } from '@/src/types/hospital';

// ticket 15 will wrap this with `persist` + a 24h TTL check; keep the API minimal so
// adding persistence is purely additive.

type HospitalsState = {
  data: Hospital[];
  loadedAt: number | null;
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
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

export const useHospitalsStore = create<HospitalsState>()((set) => ({
  data: [],
  loadedAt: null,
  isLoading: false,
  error: null,
  load: async () => {
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
      const message = e instanceof Error ? e.message : '不明なエラー';
      set({ error: message, isLoading: false });
    }
  },
}));
