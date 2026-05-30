import { Pressable, Text, View } from 'react-native';

import { t } from '@/src/i18n';

type Props = {
  name: string;
  city: string | null;
  onPress: () => void;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export function FavoriteRow({ name, city, onPress, onUp, onDown, onDelete, isFirst, isLast }: Props) {
  return (
    <View className="bg-white rounded-2xl border border-neutral-200 px-3 py-3 mb-3 flex-row items-center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={name}
        onPress={onPress}
        className="flex-1 pr-2 active:opacity-70">
        <Text className="text-base font-bold text-neutral-900" numberOfLines={1}>
          {name}
        </Text>
        {city ? <Text className="text-sm text-neutral-500 mt-0.5">{city}</Text> : null}
      </Pressable>

      <IconButton label={t('favorites.moveUp')} disabled={isFirst} onPress={onUp}>
        ↑
      </IconButton>
      <IconButton label={t('favorites.moveDown')} disabled={isLast} onPress={onDown}>
        ↓
      </IconButton>
      <IconButton label={t('favorites.delete')} onPress={onDelete} destructive>
        🗑
      </IconButton>
    </View>
  );
}

function IconButton({
  children,
  label,
  onPress,
  disabled = false,
  destructive = false,
}: {
  children: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`min-h-[44px] min-w-[44px] items-center justify-center rounded-lg ml-1 active:bg-neutral-100 ${
        destructive ? 'bg-red-50' : 'bg-neutral-50'
      } ${disabled ? 'opacity-30' : ''}`}>
      <Text className="text-lg">{children}</Text>
    </Pressable>
  );
}
