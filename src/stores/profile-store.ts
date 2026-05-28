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
  update: (partial: Partial<Profile>) => void;
  reset: () => void;
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
      update: (partial) => set(partial),
      reset: () => set(INITIAL_PROFILE),
    }),
    {
      name: 'oishasan-navi:profile',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
