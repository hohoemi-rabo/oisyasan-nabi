import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { t } from '@/src/i18n';
import type { UrgencyLevel } from '@/src/types/ai';

// 色のみに依存しないよう、背景色 + アイコン + ラベルテキストを併用する
// （アクセシビリティ要件: REQUIREMENTS §3.3.2 / project-policy）。
const STYLES: Record<
  UrgencyLevel,
  { container: string; text: string; icon: ComponentProps<typeof Ionicons>['name']; iconColor: string }
> = {
  emergency: { container: 'bg-red-50 border-red-600', text: 'text-red-700', icon: 'alert-circle', iconColor: colors.red[600] },
  soon: { container: 'bg-amber-50 border-amber-500', text: 'text-amber-700', icon: 'time', iconColor: colors.amber[600] },
  watch: { container: 'bg-green-50 border-green-600', text: 'text-green-700', icon: 'leaf', iconColor: colors.green[600] },
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
      className={`flex-row items-center rounded-[18px] border-2 px-4 py-3.5 ${style.container}`}>
      <Ionicons name={style.icon} size={26} color={style.iconColor} />
      <Text className={`ml-3 text-xl font-bold ${style.text}`}>{label}</Text>
    </View>
  );
}
