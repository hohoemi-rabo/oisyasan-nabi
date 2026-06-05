import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking, Pressable, Text, View } from 'react-native';

import { heroGradients } from '@/src/constants/colors';
import { coloredShadow } from '@/src/constants/shadows';
import { t } from '@/src/i18n';

// 最上部の巨大な 119 ボタン（DESIGN-GUIDELINES.md §5.8）。最重要 CTA を赤グラデ + 強いカラー影で最も目立たせる。
export function EmergencyCallButton() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('emergency.call119')}
      onPress={() => Linking.openURL('tel:119')}
      style={[{ borderRadius: 22, marginTop: 6, marginBottom: 8 }, coloredShadow(heroGradients.red.shadow)]}>
      <LinearGradient
        colors={heroGradients.red.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 22,
          padding: 22,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
        }}>
        <Ionicons name="call" size={34} color="#fff" />
        <View>
          <Text className="font-jp-black" style={{ color: '#fff', fontSize: 23 }}>
            {t('emergency.call119')}
          </Text>
          <Text className="font-jp-medium" style={{ color: 'rgba(255,255,255,0.92)', fontSize: 12 }}>
            {t('emergency.call119Sub')}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
