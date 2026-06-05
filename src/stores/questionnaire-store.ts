import { create } from 'zustand';

export type QuestionnaireDraft = {
  location: string[];
  duration: string | null;
  symptoms: string[];
  lumpSize: string | null;
  conditions: string[];
  medicine: boolean | null;
  memo: string;
};

// アンケートは永続化しない（毎回まっさらで開始）。ホームから「症状から探す」を選ぶ度に
// clearDraft() でリセットする運用。セッション中の一時状態のみ（メモリ常駐）。
type QuestionnaireState = QuestionnaireDraft & {
  currentStep: number;
  hasHydrated: boolean; // 復元待ちが無いので常に true（消費側のガード互換用）
  toggleLocation: (value: string) => void;
  setDuration: (value: string) => void;
  toggleSymptom: (value: string) => void;
  setLumpSize: (value: string) => void;
  toggleCondition: (value: string) => void;
  setMedicine: (value: boolean) => void;
  setMemo: (value: string) => void;
  goToStep: (step: number) => void;
  clearDraft: () => void;
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

export const useQuestionnaireStore = create<QuestionnaireState>()((set, get) => ({
  ...INITIAL_DRAFT,
  hasHydrated: true,
  toggleLocation: (value) => set({ location: toggleArrayItem(get().location, value) }),
  setDuration: (duration) => set({ duration }),
  toggleSymptom: (value) => set({ symptoms: toggleArrayItem(get().symptoms, value) }),
  setLumpSize: (lumpSize) => set({ lumpSize }),
  toggleCondition: (value) => set({ conditions: toggleArrayItem(get().conditions, value) }),
  setMedicine: (medicine) => set({ medicine }),
  setMemo: (memo) => set({ memo }),
  goToStep: (currentStep) => set({ currentStep }),
  clearDraft: () => set(INITIAL_DRAFT),
}));
