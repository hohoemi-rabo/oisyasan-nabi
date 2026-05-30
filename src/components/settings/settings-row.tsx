import { Pressable, Text } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { BrandColors } from '@/src/constants/colors';

type Props = {
  icon?: string;
  title: string;
  onPress: () => void;
  destructive?: boolean;
};

export function SettingsRow({ icon, title, onPress, destructive = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      className={`min-h-[56px] mb-3 rounded-xl px-4 py-3 flex-row items-center border active:bg-neutral-100 ${
        destructive ? 'border-red-200 bg-red-50' : 'border-neutral-200 bg-white'
      }`}>
      {icon ? <Text className="text-xl mr-3">{icon}</Text> : null}
      <Text
        className={`flex-1 text-base font-semibold ${
          destructive ? 'text-red-700' : 'text-neutral-900'
        }`}>
        {title}
      </Text>
      {destructive ? null : (
        <IconSymbol name="chevron.right" size={20} color={BrandColors.neutral500} />
      )}
    </Pressable>
  );
}
