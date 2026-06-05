import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { t } from '@/src/i18n';
import { callPhone, openWebsite } from '@/src/lib/linking';
import { useTransportServicesStore } from '@/src/stores/transport-services-store';
import type { ServiceType } from '@/src/types/transport';

type Props = {
  hospitalCity: string;
  shuttleBusInfo: string | null;
};

export function TransportSection({ hospitalCity, shuttleBusInfo }: Props) {
  const data = useTransportServicesStore((s) => s.data);
  const loadedAt = useTransportServicesStore((s) => s.loadedAt);
  const isLoading = useTransportServicesStore((s) => s.isLoading);
  const load = useTransportServicesStore((s) => s.load);

  useEffect(() => {
    if (loadedAt === null && !isLoading) load();
  }, [loadedAt, isLoading, load]);

  const matched = useMemo(
    () => data.filter((s) => s.service_area.includes(hospitalCity)),
    [data, hospitalCity],
  );

  if (!shuttleBusInfo && matched.length === 0) return null;

  return (
    <View>
      <Text className="text-sm font-semibold text-ink-500 mb-2">
        {t('hospital.transport.title')}
      </Text>

      {shuttleBusInfo ? (
        <View className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
          <View className="flex-row items-center mb-1">
            <Ionicons name="bus" size={13} color={colors.amber[700]} />
            <Text className="ml-1 text-xs font-bold text-amber-800">
              {t('hospital.transport.shuttleBus')}
            </Text>
          </View>
          <Text className="text-sm text-amber-900">{shuttleBusInfo}</Text>
        </View>
      ) : null}

      {matched.map((service) => (
        <Pressable
          key={service.id}
          accessibilityRole="button"
          accessibilityLabel={service.name}
          onPress={() =>
            router.push({ pathname: '/transport/[id]', params: { id: service.id } })
          }
          className="bg-surface border border-line rounded-xl p-3 mb-2 active:bg-neutral-50">
          <View className="flex-row items-center flex-wrap mb-1">
            <Text className="text-base font-semibold text-ink-900 mr-2">
              {service.name}
            </Text>
            <View className="bg-neutral-100 rounded-full px-2 py-0.5">
              <Text className="text-xs text-ink-500">
                {t(`hospital.transport.serviceTypes.${service.service_type satisfies ServiceType}`)}
              </Text>
            </View>
            {service.wheelchair_accessible ? (
              <View className="ml-1 flex-row items-center bg-blue-50 rounded-full px-2 py-0.5">
                <Ionicons name="accessibility" size={12} color={colors.blue[700]} />
              </View>
            ) : null}
          </View>
          <Text className="text-xs text-ink-500 mb-2">{service.operator}</Text>

          <View className="flex-row flex-wrap">
            {service.phone ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('hospital.transport.bookingPhone')}
                onPress={() => callPhone(service.phone)}
                className="min-h-[36px] px-3 py-2 mr-2 mb-1 rounded-lg bg-neutral-100 active:bg-neutral-200 flex-row items-center">
                <Ionicons name="call" size={13} color={colors.ink[700]} />
                <Text className="ml-1 text-xs font-bold text-ink-700">
                  {t('hospital.transport.bookingPhone')}
                </Text>
              </Pressable>
            ) : null}
            {service.booking_url || service.website_url ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('hospital.transport.bookingWeb')}
                onPress={() =>
                  openWebsite(service.booking_url ?? service.website_url ?? null)
                }
                className="min-h-[36px] px-3 py-2 mr-2 mb-1 rounded-lg bg-neutral-100 active:bg-neutral-200 flex-row items-center">
                <Ionicons name="globe-outline" size={13} color={colors.ink[700]} />
                <Text className="ml-1 text-xs font-bold text-ink-700">
                  {t('hospital.transport.bookingWeb')}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
}
