import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type QuestionnaireDraft = {
  location: string[];
  duration: string | null;
  symptoms: string[];
  lumpSize: string | null;
  conditions: string[];
  medicine: boolean | null;
  memo: string;
};

type QuestionnaireState = QuestionnaireDraft & {
  currentStep: number;
  hasHydrated: boolean;
  toggleLocation: (value: string) => void;
  setDuration: (value: string) => void;
  toggleSymptom: (value: string) => void;
  setLumpSize: (value: string) => void;
  toggleCondition: (value: string) => void;
  setMedicine: (value: boolean) => void;
  setMemo: (value: string) => void;
  goToStep: (step: number) => void;
  clearDraft: () => void;
  setHasHydrated: (b: boolean) => void;
};

const INITIAL_DRAFT: QuestionnaireDraft & { currentStep: number } = {
  location: [],
  duration: null,
  symptoms: [],
  lumpSize: null,
  conditions: [],
  medicine: null,
  memo: '',
  currentStep: 0,
};

function toggleArrayItem<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(
    (set, get) => ({
      ...INITIAL_DRAFT,
      hasHydrated: false,
      toggleLocation: (value) => set({ location: toggleArrayItem(get().location, value) }),
      setDuration: (duration) => set({ duration }),
      toggleSymptom: (value) => set({ symptoms: toggleArrayItem(get().symptoms, value) }),
      setLumpSize: (lumpSize) => set({ lumpSize }),
      toggleCondition: (value) => set({ conditions: toggleArrayItem(get().conditions, value) }),
      setMedicine: (medicine) => set({ medicine }),
      setMemo: (memo) => set({ memo }),
      goToStep: (currentStep) => set({ currentStep }),
      clearDraft: () => set(INITIAL_DRAFT),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'oishasan-navi:questionnaire-draft',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        location: state.location,
        duration: state.duration,
        symptoms: state.symptoms,
        lumpSize: state.lumpSize,
        conditions: state.conditions,
        medicine: state.medicine,
        memo: state.memo,
        currentStep: state.currentStep,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
