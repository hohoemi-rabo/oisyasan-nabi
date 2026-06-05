import { Text, View } from 'react-native';

import { t } from '@/src/i18n';

type Props = {
  current: number;
  total: number;
};

// 条件分岐でステップ数が変わるため、ドット固定の OnboardingProgress ではなく
// 割合ベースの塗りつぶしバーで表現する。
export function QuestionnaireProgress({ current, total }: Props) {
  const ratio = total > 0 ? Math.min(Math.max(current / total, 0), 1) : 0;

  return (
    <View className="px-6 pt-3 pb-1">
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: total, now: current }}
        className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
        <View className="h-2 rounded-full bg-teal-600" style={{ width: `${ratio * 100}%` }} />
      </View>
      <Text className="text-xs text-ink-500 mt-1 text-right">
        {t('symptoms.questionnaire.progress', { current, total })}
      </Text>
    </View>
  );
}
