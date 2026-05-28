import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const FAVORITES_LIMIT = 5;

export type Favorite = {
  id: string;
  hospitalId: string;
  sortOrder: number;
  createdAt: number;
};

type FavoritesState = {
  items: Favorite[];
  add: (hospitalId: string) => { ok: boolean; reason?: 'duplicate' | 'limit' };
  remove: (hospitalId: string) => void;
  reorder: (hospitalIds: string[]) => void;
  reset: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (hospitalId) => {
        const { items } = get();
        if (items.some((f) => f.hospitalId === hospitalId)) {
          return { ok: false, reason: 'duplicate' };
        }
        if (items.length >= FAVORITES_LIMIT) {
          return { ok: false, reason: 'limit' };
        }
        const now = Date.now();
        const next: Favorite = {
          id: `${now}-${hospitalId}`,
          hospitalId,
          sortOrder: items.length,
          createdAt: now,
        };
        set({ items: [...items, next] });
        return { ok: true };
      },
      remove: (hospitalId) => {
        const items = get()
          .items.filter((f) => f.hospitalId !== hospitalId)
          .map((f, idx) => ({ ...f, sortOrder: idx }));
        set({ items });
      },
      reorder: (hospitalIds) => {
        const { items } = get();
        const byId = new Map(items.map((f) => [f.hospitalId, f]));
        const reordered = hospitalIds
          .map((id, idx) => {
            const found = byId.get(id);
            return found ? { ...found, sortOrder: idx } : null;
          })
          .filter((f): f is Favorite => f !== null);
        set({ items: reordered });
      },
      reset: () => set({ items: [] }),
    }),
    {
      name: 'oishasan-navi:favorites',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
