import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { shadows } from '@/src/constants/shadows';

type Tone = 'blue' | 'amber' | 'teal' | 'green' | 'red';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  blue: { bg: colors.blue[50], fg: colors.blue[600] },
  amber: { bg: colors.amber[50], fg: colors.amber[600] },
  teal: { bg: colors.teal[50], fg: colors.teal[600] },
  green: { bg: colors.green[50], fg: colors.green[600] },
  red: { bg: colors.red[50], fg: colors.red[600] },
};

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  tone: Tone;
  title: string;
  onPress: () => void;
  destructive?: boolean;
};

// 設定メニュー行（DESIGN-GUIDELINES.md §5.7）。色付き角丸アイコン背景 + Ionicons。
export function SettingsRow({ icon, tone, title, onPress, destructive = false }: Props) {
  const c = TONES[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={shadows.card}
      className="min-h-[64px] mb-3 rounded-[18px] px-[15px] py-[15px] flex-row items-center bg-surface active:opacity-90">
      <View
        style={{ backgroundColor: c.bg }}
        className="w-[42px] h-[42px] rounded-[13px] items-center justify-center mr-[13px]">
        <Ionicons name={icon} size={21} color={c.fg} />
      </View>
      <Text className={`flex-1 text-[15px] font-bold ${destructive ? 'text-red-700' : 'text-ink-900'}`}>
        {title}
      </Text>
      <Ionicons name="chevron-forward" size={20} color={colors.ink[300]} />
    </Pressable>
  );
}
