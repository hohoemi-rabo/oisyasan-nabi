import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { EMPTY_CONDITIONS, type SearchConditions } from '@/src/types/hospital';

type SearchConditionsState = SearchConditions & {
  hasHydrated: boolean;
  setKeyword: (keyword: string) => void;
  toggleDepartment: (department: string) => void;
  toggleCity: (city: string) => void;
  clear: () => void;
  setHasHydrated: (b: boolean) => void;
};

function toggleArrayItem<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export const useSearchConditionsStore = create<SearchConditionsState>()(
  persist(
    (set, get) => ({
      ...EMPTY_CONDITIONS,
      hasHydrated: false,
      setKeyword: (keyword) => set({ keyword }),
      toggleDepartment: (d) => set({ departments: toggleArrayItem(get().departments, d) }),
      toggleCity: (c) => set({ cities: toggleArrayItem(get().cities, c) }),
      clear: () => set({ ...EMPTY_CONDITIONS }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'oishasan-navi:last-search-conditions',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        keyword: state.keyword,
        departments: state.departments,
        cities: state.cities,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
