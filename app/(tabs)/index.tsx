import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { HomeActionButton } from '@/src/components/common/home-action-button';
import { BrandColors } from '@/src/constants/colors';
import { t } from '@/src/i18n';

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="px-5 pt-4 pb-6">
        <View className="mb-6 pt-2">
          <Text className="text-3xl font-bold text-neutral-900">{t('home.title')}</Text>
          <Text className="text-sm text-neutral-600 mt-1">{t('home.subtitle')}</Text>
        </View>

        <HomeActionButton
          iconName="stethoscope"
          title={t('home.symptoms.title')}
          subtitle={t('home.symptoms.subtitle')}
          color={BrandColors.primary}
          onPress={() => router.push('/symptoms/questionnaire')}
        />
        <HomeActionButton
          iconName="magnifyingglass"
          title={t('home.search.title')}
          subtitle={t('home.search.subtitle')}
          color={BrandColors.info}
          onPress={() => router.push('/search')}
        />
        <HomeActionButton
          iconName="cross.case.fill"
          title={t('home.emergency.title')}
          color={BrandColors.emergency}
          onPress={() => router.push('/emergency')}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.transport.title')}
          onPress={() => router.push('/transport')}
          className="min-h-[56px] mt-2 rounded-xl px-4 py-3 flex-row items-center bg-white border border-neutral-200 active:bg-neutral-100">
          <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: BrandColors.success }}>
            <IconSymbol name="bus.fill" size={22} color="#ffffff" />
          </View>
          <Text className="flex-1 text-base font-semibold text-neutral-900">
            {t('home.transport.title')}
          </Text>
          <IconSymbol name="chevron.right" size={20} color={BrandColors.neutral500} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
