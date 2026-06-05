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
        selected ? 'border-teal-500 bg-teal-50' : 'border-line bg-surface'
      }`}>
      <View
        className={`w-7 h-7 mr-3 items-center justify-center rounded-md border-2 ${
          selected ? 'border-teal-500 bg-teal-600' : 'border-neutral-300 bg-surface'
        } ${variant === 'single' ? 'rounded-full' : ''}`}>
        {selected ? <Text className="text-sm font-bold text-white">{mark}</Text> : null}
      </View>
      <Text
        className={`flex-1 text-base ${
          selected ? 'text-teal-700 font-semibold' : 'text-ink-900'
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}
