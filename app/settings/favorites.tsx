import { router, Stack } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FavoriteRow } from '@/src/components/settings/favorite-row';
import { t } from '@/src/i18n';
import { FAVORITES_LIMIT, useFavoritesStore } from '@/src/stores/favorites-store';
import { useHospitalsStore } from '@/src/stores/hospitals-store';

export default function FavoritesScreen() {
  const items = useFavoritesStore((s) => s.items);
  const reorder = useFavoritesStore((s) => s.reorder);
  const remove = useFavoritesStore((s) => s.remove);

  const hospitals = useHospitalsStore((s) => s.data);
  const loadedAt = useHospitalsStore((s) => s.loadedAt);
  const isLoading = useHospitalsStore((s) => s.isLoading);
  const load = useHospitalsStore((s) => s.load);

  useEffect(() => {
    if (loadedAt === null && !isLoading) load();
  }, [loadedAt, isLoading, load]);

  const ordered = useMemo(
    () => [...items].sort((a, b) => a.sortOrder - b.sortOrder),
    [items],
  );
  const hospitalById = useMemo(
    () => new Map(hospitals.map((h) => [h.id, h])),
    [hospitals],
  );

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= ordered.length) return;
    const ids = ordered.map((f) => f.hospitalId);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    reorder(ids);
  };

  const handleDelete = (hospitalId: string, name: string) => {
    Alert.alert(
      t('favorites.deleteConfirm.title'),
      t('favorites.deleteConfirm.message', { name }),
      [
        { text: t('favorites.deleteConfirm.cancel'), style: 'cancel' },
        {
          text: t('favorites.deleteConfirm.confirm'),
          style: 'destructive',
          onPress: () => remove(hospitalId),
        },
      ],
    );
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg">
      <Stack.Screen options={{ title: t('favorites.title') }} />
      <ScrollView contentContainerClassName="px-5 pt-4 pb-8">
        {ordered.length === 0 ? (
          <View className="items-center justify-center py-16 px-6">
            <Text className="text-base text-ink-700 mb-2 text-center">
              {t('favorites.empty.title')}
            </Text>
            <Text className="text-sm text-ink-500 text-center">
              {t('favorites.empty.hint')}
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-sm text-ink-500 mb-3">
              {t('favorites.count', { count: ordered.length, limit: FAVORITES_LIMIT })}
            </Text>
            {ordered.map((favorite, index) => {
              const hospital = hospitalById.get(favorite.hospitalId);
              const name = hospital?.name ?? t('favorites.unknownHospital');
              return (
                <FavoriteRow
                  key={favorite.id}
                  name={name}
                  city={hospital?.city ?? null}
                  isFirst={index === 0}
                  isLast={index === ordered.length - 1}
                  onPress={() =>
                    router.push({
                      pathname: '/hospital/[id]',
                      params: { id: favorite.hospitalId },
                    })
                  }
                  onUp={() => move(index, -1)}
                  onDown={() => move(index, 1)}
                  onDelete={() => handleDelete(favorite.hospitalId, name)}
                />
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
