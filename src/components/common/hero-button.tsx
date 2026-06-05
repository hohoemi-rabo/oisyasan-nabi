import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import { heroGradients, type HeroVariant } from '@/src/constants/colors';
import { coloredShadow } from '@/src/constants/shadows';

type Props = {
  variant: HeroVariant;
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
  onPress: () => void;
};

// 立体感の主役（DESIGN-GUIDELINES.md §5.1）。グラデ + カラー影 + 半透明角丸アイコン背景。
export function HeroButton({ variant, icon, title, subtitle, onPress }: Props) {
  const g = heroGradients[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={[{ borderRadius: 22, marginBottom: 14 }, coloredShadow(g.shadow)]}>
      <LinearGradient
        colors={g.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 22,
          paddingVertical: 20,
          paddingHorizontal: 18,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}>
        <View
          style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.18)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name={icon} size={27} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text className="font-jp-black" style={{ color: '#fff', fontSize: 20 }}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              className="font-jp-medium"
              style={{ color: 'rgba(255,255,255,0.92)', fontSize: 13, marginTop: 2 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.85)" />
      </LinearGradient>
    </Pressable>
  );
}
