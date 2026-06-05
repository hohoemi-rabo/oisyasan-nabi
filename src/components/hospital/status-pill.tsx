import { Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { t } from '@/src/i18n';

// 営業状態ピル（DESIGN-GUIDELINES.md §5.3）。色付きドット + 淡色背景 + 同系の濃い文字。
// 色のみに依存しないよう、ドット + テキストを併用。
export function StatusPill({ isOpen }: { isOpen: boolean }) {
  const c = isOpen
    ? { bg: colors.green[50], dot: colors.green[500], text: colors.green[700], label: t('search.results.openNow') }
    : { bg: '#F1F5F9', dot: colors.ink[400], text: colors.ink[500], label: t('search.results.closed') };

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={c.label}
      style={{ backgroundColor: c.bg }}
      className="flex-row items-center rounded-full px-2.5 py-1">
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.dot }} className="mr-1.5" />
      <Text style={{ color: c.text }} className="text-[11px] font-bold">
        {c.label}
      </Text>
    </View>
  );
}
