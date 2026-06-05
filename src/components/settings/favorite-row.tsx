import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { shadows } from '@/src/constants/shadows';
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
    <View
      style={shadows.card}
      className="bg-surface rounded-[18px] border border-line px-3 py-3 mb-3 flex-row items-center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={name}
        onPress={onPress}
        className="flex-1 pr-2 active:opacity-70">
        <Text className="text-base font-bold text-ink-900" numberOfLines={1}>
          {name}
        </Text>
        {city ? <Text className="text-sm text-ink-500 mt-0.5">{city}</Text> : null}
      </Pressable>

      <IconButton icon="arrow-up" label={t('favorites.moveUp')} disabled={isFirst} onPress={onUp} />
      <IconButton icon="arrow-down" label={t('favorites.moveDown')} disabled={isLast} onPress={onDown} />
      <IconButton icon="trash-outline" label={t('favorites.delete')} onPress={onDelete} destructive />
    </View>
  );
}

function IconButton({
  icon,
  label,
  onPress,
  disabled = false,
  destructive = false,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
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
      style={{ backgroundColor: destructive ? colors.red[50] : '#F1F5F9' }}
      className={`min-h-[44px] min-w-[44px] items-center justify-center rounded-xl ml-1 active:opacity-70 ${
        disabled ? 'opacity-30' : ''
      }`}>
      <Ionicons
        name={icon}
        size={20}
        color={destructive ? colors.red[600] : colors.ink[500]}
      />
    </Pressable>
  );
}
