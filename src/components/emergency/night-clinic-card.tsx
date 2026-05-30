import { Pressable, Text, View } from 'react-native';

import { t } from '@/src/i18n';
import { callPhone } from '@/src/lib/linking';

// 夜間急患診療所（365日固定）。DB に night_emergency 行は無いため静的表示。
type Props = {
  emphasized?: boolean;
};

export function NightClinicCard({ emphasized = false }: Props) {
  const phone = t('emergency.nightClinic.phone');

  return (
    <View
      className={`rounded-2xl border px-4 py-4 ${
        emphasized ? 'border-blue-300 bg-blue-50' : 'border-neutral-200 bg-white'
      }`}>
      <Text className="text-base font-bold text-neutral-900">
        {t('emergency.nightClinic.title')}
      </Text>
      <Text className="text-sm text-neutral-600 mt-1">{t('emergency.nightClinic.desc')}</Text>
      <Text className="text-sm text-neutral-600 mt-1">{t('emergency.nightClinic.hours')}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('emergency.nightClinic.title')} ${t('emergency.nightClinic.call')}`}
        onPress={() => callPhone(phone)}
        className="mt-3 min-h-[44px] flex-row items-center justify-center rounded-xl bg-blue-600 active:bg-blue-700">
        <Text className="text-base mr-1">📞</Text>
        <Text className="text-sm font-semibold text-white">
          {t('emergency.nightClinic.call')}（{phone}）
        </Text>
      </Pressable>
    </View>
  );
}
