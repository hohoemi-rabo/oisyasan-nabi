import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/src/i18n';
import { callPhone, openWebsite } from '@/src/lib/linking';
import { useTransportServicesStore } from '@/src/stores/transport-services-store';

const BOOKING_METHOD_KEYS = ['phone', 'web', 'app', 'none'] as const;

function bookingMethodLabel(method: string | null): string | null {
  if (!method) return null;
  if ((BOOKING_METHOD_KEYS as readonly string[]).includes(method)) {
    return t(`transport.detail.bookingMethod.${method as (typeof BOOKING_METHOD_KEYS)[number]}`);
  }
  return method;
}

export default function TransportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useTransportServicesStore((s) => s.data);
  const loadedAt = useTransportServicesStore((s) => s.loadedAt);
  const isLoading = useTransportServicesStore((s) => s.isLoading);
  const load = useTransportServicesStore((s) => s.load);

  useEffect(() => {
    if (loadedAt === null && !isLoading) load();
  }, [loadedAt, isLoading, load]);

  const service = data.find((s) => s.id === id);

  if (!service) {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 bg-bg">
        <Stack.Screen options={{ title: t('tabs.transport') }} />
        <View className="flex-1 items-center justify-center px-6">
          {isLoading || loadedAt === null ? (
            <ActivityIndicator size="large" />
          ) : (
            <Text className="text-base text-neutral-700">{t('transport.detail.notFound')}</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const bookingUrl = service.booking_url ?? service.website_url ?? null;
  const method = bookingMethodLabel(service.booking_method);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg">
      <Stack.Screen options={{ title: service.name }} />
      <ScrollView contentContainerClassName="px-5 pt-4 pb-8">
        <View className="flex-row items-center flex-wrap mb-2">
          <Text className="text-2xl font-bold text-neutral-900 mr-2">{service.name}</Text>
          <View className="bg-neutral-100 rounded-full px-2 py-0.5">
            <Text className="text-xs text-neutral-600">
              {t(`hospital.transport.serviceTypes.${service.service_type}`)}
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl border border-neutral-200 px-4 py-2 mt-2">
          <Row label={t('transport.detail.operator')} value={service.operator} />
          <Row label={t('transport.detail.area')} value={service.service_area.join('・')} />
          {method ? <Row label={t('transport.detail.booking')} value={method} /> : null}
          {service.advance_booking_required && service.booking_deadline_hours ? (
            <Row
              label={t('transport.detail.deadline')}
              value={t('transport.detail.deadlineValue', {
                hours: service.booking_deadline_hours,
              })}
            />
          ) : null}
          {service.fare_info ? (
            <Row label={t('transport.detail.fare')} value={service.fare_info} />
          ) : null}
          {service.eligibility ? (
            <Row label={t('transport.detail.eligibility')} value={service.eligibility} />
          ) : null}
          <Row
            label={t('transport.detail.wheelchair')}
            value={
              service.wheelchair_accessible
                ? t('transport.detail.wheelchairYes')
                : t('transport.detail.wheelchairNo')
            }
          />
          {service.notes ? (
            <Row label={t('transport.detail.notes')} value={service.notes} last />
          ) : null}
        </View>

        <View className="mt-5">
          {service.phone ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('transport.detail.callBook')}
              onPress={() => callPhone(service.phone)}
              className="min-h-[56px] mb-3 rounded-xl bg-blue-600 active:bg-blue-700 items-center justify-center">
              <Text className="text-base font-semibold text-white">
                📞 {t('transport.detail.callBook')}
                {service.phone ? `（${service.phone}）` : ''}
              </Text>
            </Pressable>
          ) : null}
          {bookingUrl ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('transport.detail.webBook')}
              onPress={() => openWebsite(bookingUrl)}
              className="min-h-[56px] rounded-xl border border-neutral-200 bg-white active:bg-neutral-100 items-center justify-center">
              <Text className="text-base font-semibold text-neutral-800">
                🌐 {t('transport.detail.webBook')}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View className={`py-3 ${last ? '' : 'border-b border-neutral-100'}`}>
      <Text className="text-xs font-semibold text-neutral-500 mb-1">{label}</Text>
      <Text className="text-base text-neutral-900">{value}</Text>
    </View>
  );
}
