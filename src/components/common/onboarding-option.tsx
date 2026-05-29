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
        selected ? 'border-blue-600 bg-blue-50' : 'border-neutral-200 bg-white'
      }`}>
      <Text
        className={`text-base ${selected ? 'text-blue-700 font-semibold' : 'text-neutral-900'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
