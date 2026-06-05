import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroButton } from '@/src/components/common/hero-button';
import { colors } from '@/src/constants/colors';
import { shadows } from '@/src/constants/shadows';
import { t } from '@/src/i18n';
import { useQuestionnaireStore } from '@/src/stores/questionnaire-store';

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="px-[18px] pt-4 pb-6">
        <View className="mb-5 pt-2">
          <Text className="text-[25px] font-black text-ink-900">{t('home.title')}</Text>
          <Text className="text-[13px] font-medium text-ink-500 mt-1">{t('home.subtitle')}</Text>
        </View>

        <HeroButton
          variant="teal"
          icon="medkit"
          title={t('home.symptoms.title')}
          subtitle={t('home.symptoms.subtitle')}
          onPress={() => {
            // 毎回まっさらで開始（前回の回答を引き継がない）。
            useQuestionnaireStore.getState().clearDraft();
            router.push('/symptoms/questionnaire');
          }}
        />
        <HeroButton
          variant="blue"
          icon="search"
          title={t('home.search.title')}
          subtitle={t('home.search.subtitle')}
          onPress={() => router.push('/search')}
        />
        <HeroButton
          variant="red"
          icon="medical"
          title={t('home.emergency.title')}
          subtitle={t('home.emergency.subtitle')}
          onPress={() => router.push('/emergency')}
        />

        {/* 今日の通院サービス（サブカード） */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.transport.title')}
          onPress={() => router.push('/transport')}
          style={shadows.card}
          className="min-h-[64px] mt-1 rounded-[18px] px-4 py-[15px] flex-row items-center bg-surface active:opacity-90">
          <View
            style={{ backgroundColor: colors.green[50] }}
            className="w-[42px] h-[42px] rounded-[13px] items-center justify-center mr-[13px]">
            <Ionicons name="bus" size={21} color={colors.green[600]} />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-bold text-ink-900" numberOfLines={1}>
              {t('home.transport.title')}
            </Text>
            <Text className="text-[12px] font-medium text-ink-500 mt-0.5" numberOfLines={1}>
              {t('home.transport.subtitle')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.ink[300]} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
