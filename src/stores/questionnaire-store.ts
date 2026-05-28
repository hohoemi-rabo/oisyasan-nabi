import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type QuestionnaireAnswers = Record<string, unknown>;

type QuestionnaireState = {
  answers: QuestionnaireAnswers;
  currentStep: number;
  setAnswer: (key: string, value: unknown) => void;
  goToStep: (step: number) => void;
  reset: () => void;
};

const INITIAL_STATE = {
  answers: {} as QuestionnaireAnswers,
  currentStep: 0,
};

export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      setAnswer: (key, value) => set({ answers: { ...get().answers, [key]: value } }),
      goToStep: (step) => set({ currentStep: step }),
      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'oishasan-navi:questionnaire',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
