import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChip } from '@/src/components/common/filter-chip';
import { TransportCard } from '@/src/components/transport/transport-card';
import { CITIES } from '@/src/constants/cities';
import { SERVICE_TYPES } from '@/src/constants/transport';
import { t } from '@/src/i18n';
import { filterTransport } from '@/src/lib/transport-filter';
import { useProfileStore } from '@/src/stores/profile-store';
import { useTransportServicesStore } from '@/src/stores/transport-services-store';
import type { ServiceType } from '@/src/types/transport';

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function TransportScreen() {
  const data = useTransportServicesStore((s) => s.data);
  const loadedAt = useTransportServicesStore((s) => s.loadedAt);
  const isLoading = useTransportServicesStore((s) => s.isLoading);
  const error = useTransportServicesStore((s) => s.error);
  const load = useTransportServicesStore((s) => s.load);
  const area = useProfileStore((s) => s.residentialArea);

  // 自治体の初期選択はプロフィールの居住エリア（CITIES に含まれる時のみ）。
  const [municipalities, setMunicipalities] = useState<string[]>(
    area && (CITIES as readonly string[]).includes(area) ? [area] : [],
  );
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [barrierFree, setBarrierFree] = useState(false);

  useEffect(() => {
    if (loadedAt === null && !isLoading) load();
  }, [loadedAt, isLoading, load]);

  const results = useMemo(
    () => filterTransport(data, { municipalities, serviceTypes, barrierFree }),
    [data, municipalities, serviceTypes, barrierFree],
  );

  const clear = () => {
    setMunicipalities([]);
    setServiceTypes([]);
    setBarrierFree(false);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="px-5 pt-3 pb-8">
        <Text className="text-2xl font-bold text-neutral-900 mb-4">{t('transport.title')}</Text>

        <Section title={t('transport.filters.serviceType')}>
          <View className="flex-row flex-wrap">
            {SERVICE_TYPES.map((type) => (
              <FilterChip
                key={type}
                label={t(`hospital.transport.serviceTypes.${type}`)}
                selected={serviceTypes.includes(type)}
                onPress={() => setServiceTypes((prev) => toggle(prev, type))}
              />
            ))}
          </View>
        </Section>

        <Section title={t('transport.filters.municipality')}>
          <View className="flex-row flex-wrap">
            {CITIES.map((c) => (
              <FilterChip
                key={c}
                label={c}
                selected={municipalities.includes(c)}
                onPress={() => setMunicipalities((prev) => toggle(prev, c))}
              />
            ))}
          </View>
        </Section>

        <Section title={t('transport.filters.barrierFree')}>
          <View className="flex-row">
            <FilterChip
              label={t('transport.filters.barrierFree')}
              selected={barrierFree}
              onPress={() => setBarrierFree((v) => !v)}
            />
          </View>
        </Section>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('transport.filters.clear')}
          onPress={clear}
          className="min-h-[44px] mb-4 items-center justify-center">
          <Text className="text-sm text-neutral-500 underline">{t('transport.filters.clear')}</Text>
        </Pressable>

        {error ? (
          <View className="items-center justify-center py-10 px-6">
            <Text className="text-base text-neutral-700 mb-3">{t('transport.results.error')}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('transport.results.retry')}
              onPress={() => load()}
              className="min-h-[44px] px-5 bg-blue-600 active:bg-blue-700 rounded-xl items-center justify-center">
              <Text className="text-white text-base font-semibold">
                {t('transport.results.retry')}
              </Text>
            </Pressable>
          </View>
        ) : isLoading && data.length === 0 ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" />
            <Text className="mt-3 text-sm text-neutral-500">{t('transport.results.loading')}</Text>
          </View>
        ) : results.length === 0 ? (
          <Text className="text-sm text-neutral-500 py-10 text-center">
            {t('transport.results.empty')}
          </Text>
        ) : (
          <>
            <Text className="text-sm text-neutral-500 mb-3">
              {t('transport.results.count', { count: results.length })}
            </Text>
            {results.map((service) => (
              <TransportCard
                key={service.id}
                service={service}
                onPress={() =>
                  router.push({ pathname: '/transport/[id]', params: { id: service.id } })
                }
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-neutral-600 mb-2">{title}</Text>
      {children}
    </View>
  );
}
