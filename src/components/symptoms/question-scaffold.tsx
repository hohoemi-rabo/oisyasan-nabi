import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/colors';
import { t } from '@/src/i18n';

import { QuestionnaireProgress } from './questionnaire-progress';

type Props = {
  stepIndex: number;
  total: number;
  title: string;
  description?: string;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  onAbort: () => void;
  nextLabel?: string;
  children: ReactNode;
};

// 1 ステップ共通レイアウト。中止ボタン + 進捗バー + タイトル/説明 + content + 下部ナビ。
export function QuestionScaffold({
  stepIndex,
  total,
  title,
  description,
  canProceed,
  onBack,
  onNext,
  onAbort,
  nextLabel,
  children,
}: Props) {
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      {/* どのステップでもいつでも中止できる */}
      <View className="flex-row justify-end px-4 pt-1">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('symptoms.questionnaire.abort.action')}
          onPress={onAbort}
          className="min-h-[44px] px-2 flex-row items-center active:opacity-70">
          <Ionicons name="close" size={18} color={colors.ink[500]} />
          <Text className="ml-1 text-sm font-semibold text-ink-500">
            {t('symptoms.questionnaire.abort.action')}
          </Text>
        </Pressable>
      </View>

      <QuestionnaireProgress current={stepIndex + 1} total={total} />

      <ScrollView className="flex-1 px-6" contentContainerClassName="pt-3 pb-6">
        <Text className="text-2xl font-bold text-ink-900 mb-2">{title}</Text>
        {description ? (
          <Text className="text-sm text-ink-500 mb-4">{description}</Text>
        ) : (
          <View className="mb-4" />
        )}
        {children}
      </ScrollView>

      <View className="flex-row gap-3 px-6 pt-3 pb-4 border-t border-line">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('symptoms.questionnaire.back')}
          onPress={onBack}
          className="min-h-[52px] flex-1 items-center justify-center rounded-xl border-2 border-line active:bg-neutral-100">
          <Text className="text-base font-semibold text-ink-700">
            {t('symptoms.questionnaire.back')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={nextLabel ?? t('symptoms.questionnaire.next')}
          accessibilityState={{ disabled: !canProceed }}
          disabled={!canProceed}
          onPress={onNext}
          className={`min-h-[52px] flex-1 items-center justify-center rounded-xl ${
            canProceed ? 'bg-teal-600 active:opacity-90' : 'bg-neutral-300'
          }`}>
          <Text className="text-base font-bold text-white">
            {nextLabel ?? t('symptoms.questionnaire.next')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
