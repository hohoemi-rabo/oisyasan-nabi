import { router } from 'expo-router';
import { Alert, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SettingsRow } from '@/src/components/settings/settings-row';
import { t } from '@/src/i18n';
import { resetAppData } from '@/src/lib/reset-app-data';

export default function SettingsScreen() {
  // 二段階確認 → データ初期化 → オンボーディングへ。
  const handleReset = () => {
    Alert.alert(t('settings.reset.confirmTitle'), t('settings.reset.confirmMessage'), [
      { text: t('settings.reset.cancel'), style: 'cancel' },
      {
        text: t('settings.reset.confirm'),
        style: 'destructive',
        onPress: () => {
          Alert.alert(t('settings.reset.finalTitle'), t('settings.reset.finalMessage'), [
            { text: t('settings.reset.cancel'), style: 'cancel' },
            {
              text: t('settings.reset.finalConfirm'),
              style: 'destructive',
              onPress: () => {
                resetAppData();
                router.replace('/onboarding');
              },
            },
          ]);
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-neutral-50">
      <ScrollView contentContainerClassName="px-5 pt-4 pb-8">
        <Text className="text-2xl font-bold text-neutral-900 mb-6">{t('settings.title')}</Text>

        <SettingsRow
          icon="👤"
          title={t('settings.menu.profile')}
          onPress={() => router.push('/settings/profile')}
        />
        <SettingsRow
          icon="⭐"
          title={t('settings.menu.favorites')}
          onPress={() => router.push('/settings/favorites')}
        />
        <SettingsRow
          icon="ℹ️"
          title={t('settings.menu.about')}
          onPress={() => router.push('/settings/about')}
        />

        {/* 言語切替は Phase 1 では日本語固定のため非表示。TODO(ticket-02 / Phase 2): 言語選択行を追加。 */}

        <SettingsRow icon="🗑️" title={t('settings.menu.reset')} onPress={handleReset} destructive />
      </ScrollView>
    </SafeAreaView>
  );
}
