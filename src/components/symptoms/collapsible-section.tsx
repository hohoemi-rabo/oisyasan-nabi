import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { shadows } from '@/src/constants/shadows';

type Props = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

// NativeWind 版の折りたたみセクション（既存 components/ui/collapsible は
// Themed 依存 + defaultOpen 不可のため、画面の流儀に合わせて新規作成）。
export function CollapsibleSection({ title, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View style={shadows.card} className="rounded-[18px] border border-line bg-surface mb-3 overflow-hidden">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((v) => !v)}
        className="flex-row items-center justify-between px-4 py-3 active:opacity-90">
        <Text className="text-base font-bold text-ink-900">{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.ink[400]} />
      </Pressable>
      {open ? <View className="px-4 pb-4">{children}</View> : null}
    </View>
  );
}
