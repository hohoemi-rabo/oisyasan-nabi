import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import { t } from '@/src/i18n';
import { callPhone } from '@/src/lib/linking';

// 夜間急患診療所（365日固定。DB に night_emergency 行は無いため静的）。
// 情報カードとして淡いブルーのグラデ + ブルー枠で区別（DESIGN-GUIDELINES.md §5.8）。
export function NightClinicCard() {
  const phone = t('emergency.nightClinic.phone');

  return (
    <LinearGradient
      colors={['#F0FAFF', '#EAF4FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ borderRadius: 18, borderWidth: 1, borderColor: '#DBEAFE' }}>
      <View className="px-4 py-4">
        <Text className="text-[15px] font-bold text-ink-900">
          {t('emergency.nightClinic.title')}
        </Text>
        <Text className="text-[12.5px] font-medium text-ink-500 mt-1">
          {t('emergency.nightClinic.desc')}
        </Text>
        <Text className="text-[12.5px] font-medium text-ink-500 mt-0.5">
          {t('emergency.nightClinic.hours')}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${t('emergency.nightClinic.title')} ${t('emergency.nightClinic.call')}`}
          onPress={() => callPhone(phone)}
          className="mt-3 min-h-[44px] flex-row items-center justify-center rounded-xl bg-blue-600 active:opacity-90">
          <Ionicons name="call" size={17} color="#fff" />
          <Text className="ml-1.5 text-sm font-bold text-white">
            {t('emergency.nightClinic.call')}（{phone}）
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
