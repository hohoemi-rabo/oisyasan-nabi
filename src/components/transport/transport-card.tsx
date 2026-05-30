import { Pressable, Text, View } from 'react-native';

import { t } from '@/src/i18n';
import { callPhone, openWebsite } from '@/src/lib/linking';
import type { TransportService } from '@/src/types/transport';

type Props = {
  service: TransportService;
  onPress: () => void;
};

export function TransportCard({ service, onPress }: Props) {
  const bookingUrl = service.booking_url ?? service.website_url ?? null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={service.name}
      onPress={onPress}
      className="bg-white rounded-2xl border border-neutral-200 px-4 py-4 mb-3 active:bg-neutral-50">
      <View className="flex-row items-center flex-wrap mb-1">
        <Text className="text-lg font-bold text-neutral-900 mr-2">{service.name}</Text>
        <View className="bg-neutral-100 rounded-full px-2 py-0.5">
          <Text className="text-xs text-neutral-600">
            {t(`hospital.transport.serviceTypes.${service.service_type}`)}
          </Text>
        </View>
        {service.wheelchair_accessible ? (
          <View className="ml-1 bg-blue-50 rounded-full px-2 py-0.5">
            <Text className="text-xs text-blue-700">♿</Text>
          </View>
        ) : null}
      </View>

      <Text className="text-sm text-neutral-500">{service.operator}</Text>
      <Text className="text-sm text-neutral-500 mt-0.5">
        {t('transport.card.area')}: {service.service_area.join('・')}
      </Text>
      {service.fare_info ? (
        <Text className="text-sm text-neutral-600 mt-0.5">{service.fare_info}</Text>
      ) : null}

      <View className="flex-row flex-wrap mt-3">
        {service.phone ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('transport.card.callBook')}
            onPress={() => callPhone(service.phone)}
            className="min-h-[44px] px-4 py-2 mr-2 rounded-xl bg-blue-600 active:bg-blue-700 flex-row items-center">
            <Text className="text-sm font-semibold text-white">
              📞 {t('transport.card.callBook')}
            </Text>
          </Pressable>
        ) : null}
        {bookingUrl ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('transport.card.webBook')}
            onPress={() => openWebsite(bookingUrl)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-neutral-200 bg-white active:bg-neutral-100 flex-row items-center">
            <Text className="text-sm font-semibold text-neutral-800">
              🌐 {t('transport.card.webBook')}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}
