import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ResidentialArea } from '@/src/constants/cities';

export type AgeGroup = 'under39' | '40to64' | '65to74' | 'over75';
export type MobilityAid = 'none' | 'cane' | 'wheelchair';

export type Profile = {
  ageGroup: AgeGroup | null;
  residentialArea: ResidentialArea | null;
  mobilityAid: MobilityAid | null;
  onboarded: boolean;
};

type ProfileState = Profile & {
  hasHydrated: boolean;
  setAgeGroup: (group: AgeGroup) => void;
  setArea: (area: ResidentialArea) => void;
  setMobilityAid: (aid: MobilityAid) => void;
  completeOnboarding: () => void;
  update: (partial: Partial<Profile>) => void;
  reset: () => void;
  setHasHydrated: (b: boolean) => void;
};

const INITIAL_PROFILE: Profile = {
  ageGroup: null,
  residentialArea: null,
  mobilityAid: null,
  onboarded: false,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      ...INITIAL_PROFILE,
      hasHydrated: false,
      setAgeGroup: (ageGroup) => set({ ageGroup }),
      setArea: (residentialArea) => set({ residentialArea }),
      setMobilityAid: (mobilityAid) => set({ mobilityAid }),
      completeOnboarding: () => set({ onboarded: true }),
      update: (partial) => set(partial),
      reset: () => set(INITIAL_PROFILE),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'oishasan-navi:profile',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        ageGroup: state.ageGroup,
        residentialArea: state.residentialArea,
        mobilityAid: state.mobilityAid,
        onboarded: state.onboarded,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
