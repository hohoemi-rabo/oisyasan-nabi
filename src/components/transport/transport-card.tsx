import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { shadows } from '@/src/constants/shadows';
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
      style={shadows.card}
      className="bg-surface rounded-[18px] border border-line px-4 py-4 mb-3 active:opacity-90">
      <View className="flex-row items-center flex-wrap mb-1">
        <Text className="text-[17px] font-bold text-ink-900 mr-2">{service.name}</Text>
        <View style={{ backgroundColor: colors.teal[50] }} className="rounded-lg px-2 py-0.5">
          <Text style={{ color: colors.teal[700] }} className="text-[11px] font-bold">
            {t(`hospital.transport.serviceTypes.${service.service_type}`)}
          </Text>
        </View>
        {service.wheelchair_accessible ? (
          <View
            style={{ backgroundColor: colors.blue[50] }}
            className="ml-1 flex-row items-center rounded-lg px-2 py-0.5">
            <Ionicons name="accessibility" size={12} color={colors.blue[700]} />
          </View>
        ) : null}
      </View>

      <Text className="text-[12.5px] font-medium text-ink-500">{service.operator}</Text>
      <Text className="text-[12.5px] font-medium text-ink-500 mt-0.5">
        {t('transport.card.area')}: {service.service_area.join('・')}
      </Text>
      {service.fare_info ? (
        <Text className="text-[12.5px] font-medium text-ink-700 mt-0.5">{service.fare_info}</Text>
      ) : null}

      <View className="flex-row flex-wrap mt-3">
        {service.phone ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('transport.card.callBook')}
            onPress={() => callPhone(service.phone)}
            className="min-h-[44px] px-4 py-2 mr-2 rounded-xl bg-teal-600 active:opacity-90 flex-row items-center">
            <Ionicons name="call" size={15} color="#fff" />
            <Text className="ml-1.5 text-sm font-bold text-white">{t('transport.card.callBook')}</Text>
          </Pressable>
        ) : null}
        {bookingUrl ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('transport.card.webBook')}
            onPress={() => openWebsite(bookingUrl)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-line bg-surface active:opacity-90 flex-row items-center">
            <Ionicons name="globe-outline" size={15} color={colors.ink[700]} />
            <Text className="ml-1.5 text-sm font-bold text-ink-700">{t('transport.card.webBook')}</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}
