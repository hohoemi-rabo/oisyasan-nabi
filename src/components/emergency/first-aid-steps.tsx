import { Text, View } from 'react-native';

import { shadows } from '@/src/constants/shadows';
import { t } from '@/src/i18n';

const STEPS = ['step1', 'step2', 'step3', 'step4'] as const;

// 応急処置の基本（4 ステップ、静的 i18n コンテンツ）。
export function FirstAidSteps() {
  return (
    <View style={shadows.card} className="rounded-[18px] border border-line bg-surface px-4 py-4">
      {STEPS.map((step, index) => (
        <View key={step} className={`flex-row ${index < STEPS.length - 1 ? 'mb-3' : ''}`}>
          <View className="w-7 h-7 rounded-full bg-teal-50 items-center justify-center mr-3">
            <Text className="text-sm font-bold text-teal-700">{index + 1}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-ink-900">
              {t(`emergency.firstAid.${step}.title` as 'emergency.firstAid.step1.title')}
            </Text>
            <Text className="text-sm text-ink-500 mt-0.5 leading-relaxed">
              {t(`emergency.firstAid.${step}.body` as 'emergency.firstAid.step1.body')}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
