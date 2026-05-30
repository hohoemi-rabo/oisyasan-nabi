import { Linking, Pressable, Text, View } from 'react-native';

import { BrandColors } from '@/src/constants/colors';
import { t } from '@/src/i18n';

// 最上部の巨大な 119 ボタン。
export function EmergencyCallButton() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('emergency.call119')}
      onPress={() => Linking.openURL('tel:119')}
      style={{ backgroundColor: BrandColors.emergency }}
      className="min-h-[88px] rounded-2xl px-5 py-4 flex-row items-center active:opacity-80">
      <Text className="text-4xl mr-4">📞</Text>
      <View className="flex-1">
        <Text className="text-2xl font-bold text-white">{t('emergency.call119')}</Text>
        <Text className="text-sm text-white/90 mt-0.5">{t('emergency.call119Sub')}</Text>
      </View>
    </Pressable>
  );
}
