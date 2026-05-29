import { Text, View } from 'react-native';

import { t } from '@/src/i18n';
import type { UrgencyLevel } from '@/src/types/ai';

// 色のみに依存しないよう、背景色 + 絵文字 + ラベルテキストを併用する
// （アクセシビリティ要件: REQUIREMENTS §3.3.2 / project-policy）。
const STYLES: Record<UrgencyLevel, { container: string; text: string; emoji: string }> = {
  emergency: { container: 'bg-red-50 border-red-600', text: 'text-red-700', emoji: '🚑' },
  soon: { container: 'bg-amber-50 border-amber-500', text: 'text-amber-700', emoji: '⏱️' },
  watch: { container: 'bg-green-50 border-green-600', text: 'text-green-700', emoji: '🌿' },
};

type Props = {
  urgency: UrgencyLevel;
};

export function UrgencyBadge({ urgency }: Props) {
  const style = STYLES[urgency];
  const label = t(`symptoms.result.urgency.${urgency}`);

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      className={`flex-row items-center rounded-2xl border-2 px-4 py-3 ${style.container}`}>
      <Text className="text-2xl mr-3">{style.emoji}</Text>
      <Text className={`text-xl font-bold ${style.text}`}>{label}</Text>
    </View>
  );
}
