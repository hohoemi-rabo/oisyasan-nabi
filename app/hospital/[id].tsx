import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import type { ComponentProps } from 'react';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FacilityBadges } from '@/src/components/hospital/facility-badges';
import { ScheduleTable } from '@/src/components/hospital/schedule-table';
import { TransportSection } from '@/src/components/hospital/transport-section';
import { colors } from '@/src/constants/colors';
import { shadows } from '@/src/constants/shadows';
import { t } from '@/src/i18n';
import { isCurrentlyOpen } from '@/src/lib/is-currently-open';
import { callPhone, openGoogleMaps, openWebsite } from '@/src/lib/linking';
import { FAVORITES_LIMIT, useFavoritesStore } from '@/src/stores/favorites-store';
import { useHospitalsStore } from '@/src/stores/hospitals-store';

export default function HospitalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const data = useHospitalsStore((s) => s.data);
  const isLoading = useHospitalsStore((s) => s.isLoading);
  const error = useHospitalsStore((s) => s.error);
  const loadedAt = useHospitalsStore((s) => s.loadedAt);
  const load = useHospitalsStore((s) => s.load);

  const favorites = useFavoritesStore((s) => s.items);
  const addFavorite = useFavoritesStore((s) => s.add);
  const removeFavorite = useFavoritesStore((s) => s.remove);

  useEffect(() => {
    if (loadedAt === null && !isLoading) load();
  }, [load, loadedAt, isLoading]);

  const hospital = useMemo(() => data.find((h) => h.id === id), [data, id]);
  const isFavorite = useMemo(
    () => Boolean(id && favorites.some((f) => f.hospitalId === id)),
    [favorites, id],
  );
  const open = useMemo(() => (hospital ? isCurrentlyOpen(hospital) : false), [hospital]);

  if (error) {
    return (
      <Centered>
        <Text className="text-base text-ink-700 mb-3">{t('hospital.error')}</Text>
        <Text className="text-xs text-ink-500 mb-4">{error}</Text>
        <PrimaryButton label={t('hospital.retry')} onPress={() => load()} />
      </Centered>
    );
  }
  if (isLoading && data.length === 0) {
    return (
      <Centered>
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-sm text-ink-500">{t('hospital.loading')}</Text>
      </Centered>
    );
  }
  if (!hospital) {
    return (
      <Centered>
        <Text className="text-base text-ink-700 mb-4">{t('hospital.notFound.title')}</Text>
        <PrimaryButton label={t('hospital.notFound.back')} onPress={() => router.back()} />
      </Centered>
    );
  }

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      removeFavorite(hospital.id);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }
    const result = addFavorite(hospital.id);
    if (result.ok) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (result.reason === 'limit') {
      Alert.alert(
        t('hospital.favorite.limitReached', { limit: FAVORITES_LIMIT }),
      );
    }
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg">
      <Stack.Screen options={{ title: hospital.name }} />
      <ScrollView contentContainerClassName="px-5 pt-4 pb-10">
        <View className="mb-4">
          <View className="flex-row items-center flex-wrap mb-2">
            <Text className="text-2xl font-bold text-ink-900 mr-2">{hospital.name}</Text>
            <View
              className={`px-2 py-0.5 rounded-full ${open ? 'bg-green-100' : 'bg-neutral-100'}`}>
              <Text
                className={`text-xs font-semibold ${
                  open ? 'text-green-700' : 'text-ink-500'
                }`}>
                {open ? `● ${t('hospital.openNow')}` : `○ ${t('hospital.closed')}`}
              </Text>
            </View>
          </View>
          {hospital.category.length > 0 ? (
            <View className="flex-row flex-wrap">
              {hospital.category.map((c) => (
                <View
                  key={c}
                  className="bg-neutral-100 rounded-full px-2 py-0.5 mr-1.5 mb-1">
                  <Text className="text-xs text-ink-500">{c}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <Section>
          <Row label={t('hospital.info.address')}>
            {hospital.city}
            {hospital.address ? `  ${hospital.address}` : ''}
          </Row>
          {hospital.tel ? <Row label={t('hospital.info.phone')}>{hospital.tel}</Row> : null}
          {hospital.opening_hours ? (
            <Row label={t('hospital.info.openingHours')} preserveLines>
              {hospital.opening_hours}
            </Row>
          ) : null}
        </Section>

        <View className="flex-row mb-4">
          {hospital.tel ? (
            <ActionButton label={t('hospital.actions.call')} icon="call" onPress={() => callPhone(hospital.tel)} />
          ) : null}
          <ActionButton
            label={t('hospital.actions.map')}
            icon="map"
            onPress={() =>
              openGoogleMaps({
                latitude: hospital.latitude,
                longitude: hospital.longitude,
                address: hospital.address,
                googleMapUrl: hospital.google_map_url,
              })
            }
          />
          {hospital.website ? (
            <ActionButton label={t('hospital.actions.website')} icon="globe-outline" onPress={() => openWebsite(hospital.website)} />
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? t('hospital.favorite.remove') : t('hospital.favorite.add')}
          onPress={handleToggleFavorite}
          className={`min-h-[52px] mb-5 rounded-xl items-center justify-center flex-row active:opacity-90 ${
            isFavorite ? 'bg-amber-50 border-2 border-amber-200' : 'bg-amber-600'
          }`}>
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={18}
            color={isFavorite ? colors.amber[700] : '#fff'}
          />
          <Text className={`ml-2 text-base font-bold ${isFavorite ? 'text-amber-700' : 'text-white'}`}>
            {isFavorite ? t('hospital.favorite.remove') : t('hospital.favorite.add')}
          </Text>
        </Pressable>

        {hospital.schedules && hospital.schedules.length > 0 ? (
          <Section title={t('hospital.schedule.title')}>
            <ScheduleTable schedules={hospital.schedules} />
          </Section>
        ) : null}

        <SectionInline>
          <FacilityBadges hospital={hospital} />
        </SectionInline>

        <SectionInline>
          <TransportSection
            hospitalCity={hospital.city}
            shuttleBusInfo={hospital.shuttle_bus ? hospital.shuttle_bus_info : null}
          />
        </SectionInline>

        {hospital.note ? (
          <Section title={t('hospital.note')}>
            <Text className="text-sm text-ink-700 leading-relaxed">{hospital.note}</Text>
          </Section>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg items-center justify-center px-6">
      {children}
    </SafeAreaView>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="min-h-[44px] px-5 bg-blue-600 active:bg-blue-700 rounded-xl items-center justify-center">
      <Text className="text-white text-base font-semibold">{label}</Text>
    </Pressable>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View className="bg-surface border border-line rounded-xl p-4 mb-4">
      {title ? (
        <Text className="text-sm font-semibold text-ink-500 mb-3">{title}</Text>
      ) : null}
      {children}
    </View>
  );
}

function SectionInline({ children }: { children: React.ReactNode }) {
  return <View className="mb-4">{children}</View>;
}

function Row({
  label,
  children,
  preserveLines,
}: {
  label: string;
  children: React.ReactNode;
  preserveLines?: boolean;
}) {
  return (
    <View className="mb-2 last:mb-0">
      <Text className="text-xs font-semibold text-ink-500 mb-1">{label}</Text>
      <Text className={`text-sm text-ink-900 ${preserveLines ? '' : ''}`}>{children}</Text>
    </View>
  );
}

function ActionButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={shadows.card}
      className="flex-1 mx-1 min-h-[60px] bg-surface border border-line rounded-[18px] items-center justify-center active:opacity-90">
      <Ionicons name={icon} size={20} color={colors.teal[600]} />
      <Text className="mt-0.5 text-xs font-bold text-ink-700">{label}</Text>
    </Pressable>
  );
}
