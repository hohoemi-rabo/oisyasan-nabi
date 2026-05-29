import { Pressable, Text } from 'react-native';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterChip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      className={`min-h-[44px] px-4 py-2 rounded-full border-2 mr-2 mb-2 items-center justify-center active:opacity-80 ${
        selected ? 'border-blue-600 bg-blue-50' : 'border-neutral-200 bg-white'
      }`}>
      <Text
        className={`text-sm ${
          selected ? 'text-blue-700 font-semibold' : 'text-neutral-700'
        }`}>
        {selected ? `✓ ${label}` : label}
      </Text>
    </Pressable>
  );
}
