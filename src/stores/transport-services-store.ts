import { create } from 'zustand';

import { supabase } from '@/src/lib/supabase';
import type { TransportService } from '@/src/types/transport';

// Same shape as hospitals-store. ticket 15 will wrap with persist + 24h TTL.

type TransportServicesState = {
  data: TransportService[];
  loadedAt: number | null;
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
};

export const useTransportServicesStore = create<TransportServicesState>()((set) => ({
  data: [],
  loadedAt: null,
  isLoading: false,
  error: null,
  load: async () => {
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
}));
