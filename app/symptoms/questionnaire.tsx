import { router } from 'expo-router';
import { Alert, Switch, Text, TextInput, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { BigCheckbox } from '@/src/components/symptoms/big-checkbox';
import { QuestionScaffold } from '@/src/components/symptoms/question-scaffold';
import {
  CONDITIONS_OPTIONS,
  DURATION_OPTIONS,
  LOCATION_OPTIONS,
  LUMP_SIZE_OPTIONS,
  LUMP_SYMPTOM_VALUE,
  type SymptomOption,
  SYMPTOM_OPTIONS,
} from '@/src/constants/symptom-options';
import { t, type TranslationKey } from '@/src/i18n';
import { useQuestionnaireStore } from '@/src/stores/questionnaire-store';

// 選択肢ラベルはリポ内定数 + ja.json により存在が保証される動的キー。
// TranslationKey の文字列リテラル制約は満たせないため、ここだけ明示アサーションする。
const tx = (key: string): string => t(key as TranslationKey);

type StepKey =
  | 'location'
  | 'duration'
  | 'symptoms'
  | 'lumpSize'
  | 'conditions'
  | 'medicine'
  | 'memo'
  | 'confirm';

function optionLabel(group: string, value: string, options: SymptomOption[]): string {
  const found = options.find((o) => o.value === value);
  return found ? tx(`symptoms.questionnaire.options.${group}.${found.labelKey}`) : value;
}

export default function SymptomsQuestionnaireScreen() {
  const draft = useQuestionnaireStore(
    useShallow((s) => ({
      location: s.location,
      duration: s.duration,
      symptoms: s.symptoms,
      lumpSize: s.lumpSize,
      conditions: s.conditions,
      medicine: s.medicine,
      memo: s.memo,
      currentStep: s.currentStep,
    })),
  );
  const hasHydrated = useQuestionnaireStore((s) => s.hasHydrated);
  const toggleLocation = useQuestionnaireStore((s) => s.toggleLocation);
  const setDuration = useQuestionnaireStore((s) => s.setDuration);
  const toggleSymptom = useQuestionnaireStore((s) => s.toggleSymptom);
  const setLumpSize = useQuestionnaireStore((s) => s.setLumpSize);
  const toggleCondition = useQuestionnaireStore((s) => s.toggleCondition);
  const setMedicine = useQuestionnaireStore((s) => s.setMedicine);
  const setMemo = useQuestionnaireStore((s) => s.setMemo);
  const goToStep = useQuestionnaireStore((s) => s.goToStep);
  const clearDraft = useQuestionnaireStore((s) => s.clearDraft);

  // 永続化の復元前は currentStep が 0 に見えるため、ハイドレ完了まで待つ。
  if (!hasHydrated) return null;

  // 「しこり」選択時のみ lumpSize を挟む動的ステップ列。
  const steps: StepKey[] = ['location', 'duration', 'symptoms'];
  if (draft.symptoms.includes(LUMP_SYMPTOM_VALUE)) steps.push('lumpSize');
  steps.push('conditions', 'medicine', 'memo', 'confirm');

  const stepIndex = Math.min(Math.max(draft.currentStep, 0), steps.length - 1);
  const stepKey = steps[stepIndex];

  const canProceed = (() => {
    switch (stepKey) {
      case 'location':
        return draft.location.length > 0;
      case 'duration':
        return draft.duration !== null;
      case 'symptoms':
        return draft.symptoms.length > 0;
      default:
        return true;
    }
  })();

  // どのステップでも中止できる（確認ダイアログ → 下書き破棄してホームへ）。
  const handleAbort = () => {
    Alert.alert(
      t('symptoms.questionnaire.abort.title'),
      t('symptoms.questionnaire.abort.message'),
      [
        { text: t('symptoms.questionnaire.abort.cancel'), style: 'cancel' },
        {
          text: t('symptoms.questionnaire.abort.confirm'),
          style: 'destructive',
          onPress: () => {
            clearDraft();
            router.back();
          },
        },
      ],
    );
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      // 先頭で「戻る」はそのままホームへ（明示的な破棄は「中止」ボタンで）。
      router.back();
      return;
    }
    goToStep(stepIndex - 1);
  };

  const handleNext = () => {
    if (stepKey === 'confirm') {
      router.push('/symptoms/results');
      return;
    }
    goToStep(stepIndex + 1);
  };

  const renderContent = () => {
    switch (stepKey) {
      case 'location':
        return LOCATION_OPTIONS.map((o) => (
          <BigCheckbox
            key={o.value}
            variant="multi"
            label={tx(`symptoms.questionnaire.options.location.${o.labelKey}`)}
            selected={draft.location.includes(o.value)}
            onPress={() => toggleLocation(o.value)}
          />
        ));
      case 'duration':
        return DURATION_OPTIONS.map((o) => (
          <BigCheckbox
            key={o.value}
            variant="single"
            label={tx(`symptoms.questionnaire.options.duration.${o.labelKey}`)}
            selected={draft.duration === o.value}
            onPress={() => setDuration(o.value)}
          />
        ));
      case 'symptoms':
        return SYMPTOM_OPTIONS.map((o) => (
          <BigCheckbox
            key={o.value}
            variant="multi"
            label={tx(`symptoms.questionnaire.options.symptoms.${o.labelKey}`)}
            selected={draft.symptoms.includes(o.value)}
            onPress={() => toggleSymptom(o.value)}
          />
        ));
      case 'lumpSize':
        return LUMP_SIZE_OPTIONS.map((o) => (
          <BigCheckbox
            key={o.value}
            variant="single"
            label={tx(`symptoms.questionnaire.options.lumpSize.${o.labelKey}`)}
            selected={draft.lumpSize === o.value}
            onPress={() => setLumpSize(o.value)}
          />
        ));
      case 'conditions':
        return CONDITIONS_OPTIONS.map((o) => (
          <BigCheckbox
            key={o.value}
            variant="multi"
            label={tx(`symptoms.questionnaire.options.conditions.${o.labelKey}`)}
            selected={draft.conditions.includes(o.value)}
            onPress={() => toggleCondition(o.value)}
          />
        ));
      case 'medicine':
        return (
          <View className="min-h-[56px] flex-row items-center justify-between rounded-xl border-2 border-line px-4 py-4">
            <Text className="flex-1 text-base text-ink-900">
              {t('symptoms.questionnaire.medicine.label')}
            </Text>
            <View className="flex-row items-center">
              <Text className="mr-3 text-base font-semibold text-ink-700">
                {draft.medicine
                  ? t('symptoms.questionnaire.medicine.yes')
                  : t('symptoms.questionnaire.medicine.no')}
              </Text>
              <Switch
                accessibilityLabel={t('symptoms.questionnaire.medicine.label')}
                value={draft.medicine === true}
                onValueChange={setMedicine}
              />
            </View>
          </View>
        );
      case 'memo':
        return (
          <TextInput
            accessibilityLabel={t('symptoms.questionnaire.steps.memo.title')}
            value={draft.memo}
            onChangeText={setMemo}
            placeholder={t('symptoms.questionnaire.memo.placeholder')}
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
            className="min-h-[140px] rounded-xl border-2 border-line px-4 py-3 text-base text-ink-900"
          />
        );
      case 'confirm':
        return <ConfirmSummary draft={draft} />;
      default:
        return null;
    }
  };

  const nextLabel =
    stepKey === 'confirm' ? t('symptoms.questionnaire.confirm.submit') : undefined;

  return (
    <QuestionScaffold
      stepIndex={stepIndex}
      total={steps.length}
      title={t(`symptoms.questionnaire.steps.${stepKey}.title` as TranslationKey)}
      description={tx(`symptoms.questionnaire.steps.${stepKey}.description`)}
      canProceed={canProceed}
      onBack={handleBack}
      onNext={handleNext}
      onAbort={handleAbort}
      nextLabel={nextLabel}>
      {renderContent()}
    </QuestionScaffold>
  );
}

type ConfirmDraft = {
  location: string[];
  duration: string | null;
  symptoms: string[];
  lumpSize: string | null;
  conditions: string[];
  medicine: boolean | null;
  memo: string;
};

function ConfirmSummary({ draft }: { draft: ConfirmDraft }) {
  const empty = t('symptoms.questionnaire.confirm.emptyValue');

  const rows: { labelKey: string; value: string }[] = [
    {
      labelKey: 'location',
      value:
        draft.location.map((v) => optionLabel('location', v, LOCATION_OPTIONS)).join('、') ||
        empty,
    },
    {
      labelKey: 'duration',
      value: draft.duration ? optionLabel('duration', draft.duration, DURATION_OPTIONS) : empty,
    },
    {
      labelKey: 'symptoms',
      value:
        draft.symptoms.map((v) => optionLabel('symptoms', v, SYMPTOM_OPTIONS)).join('、') ||
        empty,
    },
    {
      labelKey: 'lumpSize',
      value: draft.lumpSize ? optionLabel('lumpSize', draft.lumpSize, LUMP_SIZE_OPTIONS) : empty,
    },
    {
      labelKey: 'conditions',
      value:
        draft.conditions
          .map((v) => optionLabel('conditions', v, CONDITIONS_OPTIONS))
          .join('、') || empty,
    },
    {
      labelKey: 'medicine',
      value:
        draft.medicine === null
          ? empty
          : draft.medicine
            ? t('symptoms.questionnaire.medicine.yes')
            : t('symptoms.questionnaire.medicine.no'),
    },
    { labelKey: 'memo', value: draft.memo.trim() || empty },
  ];

  // しこりを選んでいない時は lumpSize 行を出さない。
  const visibleRows = rows.filter(
    (r) => r.labelKey !== 'lumpSize' || draft.symptoms.includes(LUMP_SYMPTOM_VALUE),
  );

  return (
    <View>
      {visibleRows.map((row) => (
        <View key={row.labelKey} className="mb-3 border-b border-line pb-3">
          <Text className="mb-1 text-xs font-semibold text-ink-500">
            {tx(`symptoms.questionnaire.confirm.fields.${row.labelKey}`)}
          </Text>
          <Text className="text-base text-ink-900">{row.value}</Text>
        </View>
      ))}
    </View>
  );
}
