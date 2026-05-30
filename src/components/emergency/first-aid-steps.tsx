import { Text, View } from 'react-native';

import { t } from '@/src/i18n';

const STEPS = ['step1', 'step2', 'step3', 'step4'] as const;

// 応急処置の基本（4 ステップ、静的 i18n コンテンツ）。
export function FirstAidSteps() {
  return (
    <View className="rounded-2xl border border-neutral-200 bg-white px-4 py-4">
      <Text className="text-base font-bold text-neutral-900 mb-3">
        {t('emergency.firstAid.title')}
      </Text>
      {STEPS.map((step, index) => (
        <View key={step} className="flex-row mb-3 last:mb-0">
          <View className="w-7 h-7 rounded-full bg-blue-100 items-center justify-center mr-3">
            <Text className="text-sm font-bold text-blue-700">{index + 1}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-neutral-900">
              {t(`emergency.firstAid.${step}.title` as 'emergency.firstAid.step1.title')}
            </Text>
            <Text className="text-sm text-neutral-600 mt-0.5 leading-relaxed">
              {t(`emergency.firstAid.${step}.body` as 'emergency.firstAid.step1.body')}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
