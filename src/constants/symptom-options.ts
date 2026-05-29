// 症状アンケートの選択肢定義（REQUIREMENTS.md §3.3.1）。
// value = AI（Cloudflare Workers / Gemini）へ送る日本語カノニカル文字列。
// labelKey = 表示用 i18n キー（symptoms.questionnaire.options.<group>.<labelKey>）。

export type SymptomOption = {
  value: string;
  labelKey: string;
};

// 「しこり」選択時のみ lumpSize ステップを出すための判定値。
export const LUMP_SYMPTOM_VALUE = 'しこり';

export const LOCATION_OPTIONS: SymptomOption[] = [
  { value: 'のど', labelKey: 'throat' },
  { value: 'むね', labelKey: 'chest' },
  { value: 'おなか', labelKey: 'stomach' },
  { value: 'あし', labelKey: 'leg' },
  { value: 'うで', labelKey: 'arm' },
  { value: 'あたま', labelKey: 'head' },
  { value: 'かお', labelKey: 'face' },
  { value: 'せなか', labelKey: 'back' },
  { value: 'こし', labelKey: 'lowerBack' },
  { value: 'その他', labelKey: 'other' },
];

export const DURATION_OPTIONS: SymptomOption[] = [
  { value: '今日', labelKey: 'today' },
  { value: '2-3日前', labelKey: 'fewDays' },
  { value: '1週間前', labelKey: 'oneWeek' },
  { value: '2週間前', labelKey: 'twoWeeks' },
  { value: '1ヶ月以上前', labelKey: 'overMonth' },
];

export const SYMPTOM_OPTIONS: SymptomOption[] = [
  { value: '痛い', labelKey: 'pain' },
  { value: 'しこり', labelKey: 'lump' },
  { value: 'かゆい', labelKey: 'itch' },
  { value: '赤い・はれ', labelKey: 'swelling' },
  { value: '熱', labelKey: 'fever' },
  { value: 'せき', labelKey: 'cough' },
  { value: '息苦しい', labelKey: 'breathless' },
  { value: 'めまい', labelKey: 'dizzy' },
  { value: 'その他', labelKey: 'other' },
];

// 要件に具体的なサイズ列挙はないため、受診時に伝えやすい実用的なバケットを採用。
export const LUMP_SIZE_OPTIONS: SymptomOption[] = [
  { value: '1cm未満', labelKey: 'under1cm' },
  { value: '1〜3cm', labelKey: 'from1to3cm' },
  { value: '3cm以上', labelKey: 'over3cm' },
  { value: 'わからない', labelKey: 'unknown' },
];

// 持病（複数選択）。要件に具体列挙はないため代表的な慢性疾患を採用。
export const CONDITIONS_OPTIONS: SymptomOption[] = [
  { value: '高血圧', labelKey: 'hypertension' },
  { value: '糖尿病', labelKey: 'diabetes' },
  { value: '心臓病', labelKey: 'heartDisease' },
  { value: '脳卒中', labelKey: 'stroke' },
  { value: 'がん', labelKey: 'cancer' },
  { value: 'ぜんそく', labelKey: 'asthma' },
  { value: '腎臓病', labelKey: 'kidneyDisease' },
  { value: 'アレルギー', labelKey: 'allergy' },
  { value: 'その他', labelKey: 'other' },
  { value: '特になし', labelKey: 'none' },
];
