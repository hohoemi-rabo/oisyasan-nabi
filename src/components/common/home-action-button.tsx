import { Pressable, Text, View } from 'react-native';

import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';

type Props = {
  iconName: IconSymbolName;
  title: string;
  subtitle?: string;
  color: string;
  onPress: () => void;
};

export function HomeActionButton({ iconName, title, subtitle, color, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={{ backgroundColor: color }}
      className="min-h-[96px] rounded-2xl px-5 py-4 mb-3 flex-row items-center active:opacity-80">
      <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center mr-4">
        <IconSymbol name={iconName} size={32} color="#ffffff" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-white">{title}</Text>
        {subtitle ? <Text className="text-sm text-white/85 mt-1">{subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}
