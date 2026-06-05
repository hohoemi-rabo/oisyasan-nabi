import { Pressable, Text } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  selected?: boolean;
};

export function OnboardingOption({ label, onPress, selected = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`min-h-[56px] py-4 px-4 mb-3 rounded-xl border-2 active:bg-neutral-100 ${
        selected ? 'border-teal-500 bg-teal-50' : 'border-line bg-surface'
      }`}>
      <Text
        className={`text-base ${selected ? 'text-teal-700 font-semibold' : 'text-ink-900'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
