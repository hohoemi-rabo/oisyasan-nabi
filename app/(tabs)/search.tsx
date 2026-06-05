import { router } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChip } from '@/src/components/common/filter-chip';
import { CITIES, OUTSIDE_AREA } from '@/src/constants/cities';
import { DEPARTMENTS } from '@/src/constants/departments';
import { t } from '@/src/i18n';
import { useSearchConditionsStore } from '@/src/stores/search-conditions-store';

export default function SearchScreen() {
  const keyword = useSearchConditionsStore((s) => s.keyword);
  const departments = useSearchConditionsStore((s) => s.departments);
  const cities = useSearchConditionsStore((s) => s.cities);
  const setKeyword = useSearchConditionsStore((s) => s.setKeyword);
  const toggleDepartment = useSearchConditionsStore((s) => s.toggleDepartment);
  const toggleCity = useSearchConditionsStore((s) => s.toggleCity);
  const clear = useSearchConditionsStore((s) => s.clear);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="px-5 pt-3 pb-32" keyboardShouldPersistTaps="handled">
        <Text className="text-2xl font-bold text-ink-900 mb-4">{t('search.title')}</Text>

        <Section title={t('search.keyword.label')}>
          <TextInput
            accessibilityLabel={t('search.keyword.label')}
            placeholder={t('search.keyword.placeholder')}
            value={keyword}
            onChangeText={setKeyword}
            className="bg-surface border border-line rounded-xl px-4 py-3 text-base text-ink-900"
            placeholderTextColor="#9ca3af"
          />
        </Section>

        <Section title={t('search.departments')}>
          <View className="flex-row flex-wrap">
            {DEPARTMENTS.map((d) => (
              <FilterChip
                key={d}
                label={d}
                selected={departments.includes(d)}
                onPress={() => toggleDepartment(d)}
              />
            ))}
          </View>
        </Section>

        <Section title={t('search.cities')}>
          <View className="flex-row flex-wrap">
            {CITIES.map((c) => (
              <FilterChip
                key={c}
                label={c}
                selected={cities.includes(c)}
                onPress={() => toggleCity(c)}
              />
            ))}
            <FilterChip
              key={OUTSIDE_AREA}
              label={t('search.outsideArea')}
              selected={cities.includes(OUTSIDE_AREA)}
              onPress={() => toggleCity(OUTSIDE_AREA)}
            />
          </View>
        </Section>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('search.submit')}
          onPress={() => router.push('/search/results')}
          className="min-h-[56px] mt-4 bg-teal-600 active:opacity-90 rounded-xl items-center justify-center">
          <Text className="text-base font-bold text-white">{t('search.submit')}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('search.clear')}
          onPress={clear}
          className="min-h-[44px] mt-3 items-center justify-center">
          <Text className="text-sm text-ink-500 underline">{t('search.clear')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="text-sm font-semibold text-ink-500 mb-2">{title}</Text>
      {children}
    </View>
  );
}
