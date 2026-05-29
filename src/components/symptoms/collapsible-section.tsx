import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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
    <View className="rounded-2xl border border-neutral-200 bg-white mb-3 overflow-hidden">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((v) => !v)}
        className="flex-row items-center justify-between px-4 py-3 active:bg-neutral-50">
        <Text className="text-base font-bold text-neutral-900">{title}</Text>
        <Text className="text-base text-neutral-400">{open ? '▲' : '▼'}</Text>
      </Pressable>
      {open ? <View className="px-4 pb-4">{children}</View> : null}
    </View>
  );
}
