import { Pressable, Text, View } from 'react-native';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  // multi = 複数選択（チェックボックス）、single = 単一選択（ラジオ）。
  variant?: 'multi' | 'single';
};

export function BigCheckbox({ label, selected, onPress, variant = 'multi' }: Props) {
  const mark = variant === 'multi' ? '✓' : '●';

  return (
    <Pressable
      accessibilityRole={variant === 'multi' ? 'checkbox' : 'radio'}
      accessibilityLabel={label}
      accessibilityState={variant === 'multi' ? { checked: selected } : { selected }}
      onPress={onPress}
      className={`min-h-[56px] flex-row items-center py-4 px-4 mb-3 rounded-xl border-2 active:bg-neutral-100 ${
        selected ? 'border-blue-600 bg-blue-50' : 'border-neutral-200 bg-white'
      }`}>
      <View
        className={`w-7 h-7 mr-3 items-center justify-center rounded-md border-2 ${
          selected ? 'border-blue-600 bg-blue-600' : 'border-neutral-300 bg-white'
        } ${variant === 'single' ? 'rounded-full' : ''}`}>
        {selected ? <Text className="text-sm font-bold text-white">{mark}</Text> : null}
      </View>
      <Text
        className={`flex-1 text-base ${
          selected ? 'text-blue-700 font-semibold' : 'text-neutral-900'
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}
