import { Pressable, Text } from 'react-native';

import { shadows } from '@/src/constants/shadows';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

// 条件チップ（DESIGN-GUIDELINES.md §5.5）。未選択/選択でメリハリ（選択= teal + 影 + ✓）。
export function FilterChip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={selected ? shadows.sm : undefined}
      className={`min-h-[44px] px-4 py-2 rounded-full border-[1.5px] mr-2 mb-2 items-center justify-center active:opacity-80 ${
        selected ? 'border-teal-500 bg-teal-50' : 'border-line bg-surface'
      }`}>
      <Text className={`text-sm font-bold ${selected ? 'text-teal-700' : 'text-ink-700'}`}>
        {selected ? `✓ ${label}` : label}
      </Text>
    </Pressable>
  );
}
