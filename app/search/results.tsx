import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { HospitalCard } from '@/src/components/hospital/hospital-card';
import { colors } from '@/src/constants/colors';
import { t } from '@/src/i18n';
import { logSearch } from '@/src/lib/search-log';
import { searchHospitals } from '@/src/lib/search-hospitals';
import { useHospitalsStore } from '@/src/stores/hospitals-store';
import { useProfileStore } from '@/src/stores/profile-store';
import { useSearchConditionsStore } from '@/src/stores/search-conditions-store';

export default function SearchResultsScreen() {
  const data = useHospitalsStore((s) => s.data);
  const isLoading = useHospitalsStore((s) => s.isLoading);
  const error = useHospitalsStore((s) => s.error);
  const loadedAt = useHospitalsStore((s) => s.loadedAt);
  const load = useHospitalsStore((s) => s.load);

  const conditions = useSearchConditionsStore(
    useShallow((s) => ({
      keyword: s.keyword,
      departments: s.departments,
      cities: s.cities,
      facilities: s.facilities,
    })),
  );
  const area = useProfileStore((s) => s.residentialArea);

  useEffect(() => {
    if (loadedAt === null && !isLoading) load();
  }, [load, loadedAt, isLoading]);

  useEffect(() => {
    logSearch(conditions, area);
    // Intentionally fire once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = useMemo(() => searchHospitals(data, conditions), [data, conditions]);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg">
      <Stack.Screen
        options={{
          title: isLoading || error
            ? t('search.title')
            : t('search.results.count', { count: results.length }),
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.backHome')}
              onPress={() => router.replace('/(tabs)')}
              className="min-h-[44px] px-2 flex-row items-center justify-center active:opacity-70">
              <Ionicons name="home" size={16} color={colors.teal[600]} />
              <Text className="ml-1 text-base font-bold text-teal-600">{t('common.home')}</Text>
            </Pressable>
          ),
        }}
      />
      {error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-ink-700 mb-3">{t('search.results.error')}</Text>
          <Text className="text-xs text-ink-500 mb-4">{error}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('search.results.retry')}
            onPress={() => load()}
            className="min-h-[44px] px-5 bg-blue-600 active:bg-blue-700 rounded-xl items-center justify-center">
            <Text className="text-white text-base font-semibold">{t('search.results.retry')}</Text>
          </Pressable>
        </View>
      ) : isLoading && data.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-3 text-sm text-ink-500">{t('search.results.loading')}</Text>
        </View>
      ) : results.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-ink-700 mb-4 text-center">
            {t('search.results.empty.title')}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('search.results.empty.action')}
            onPress={() => router.back()}
            className="min-h-[44px] px-5 bg-blue-600 active:bg-blue-700 rounded-xl items-center justify-center">
            <Text className="text-white text-base font-semibold">
              {t('search.results.empty.action')}
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(h) => h.id}
          contentContainerClassName="px-5 pt-3 pb-6"
          renderItem={({ item }) => (
            <HospitalCard
              hospital={item}
              matchedDepartments={conditions.departments}
              onPress={() => router.push({ pathname: '/hospital/[id]', params: { id: item.id } })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
