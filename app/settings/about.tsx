import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SettingsRow } from '@/src/components/settings/settings-row';
import { t } from '@/src/i18n';

// TODO(ticket-17): 利用規約・プライバシーポリシーの公開 URL を確定して設定する。
// 空のうちは「準備中」を表示する。
const TERMS_URL = '';
const PRIVACY_URL = '';

async function openOrComingSoon(url: string) {
  if (!url) {
    Alert.alert(t('settings.about.comingSoon'));
    return;
  }
  await WebBrowser.openBrowserAsync(url);
}

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '—';

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg">
      <Stack.Screen options={{ title: t('settings.about.title') }} />
      <ScrollView contentContainerClassName="px-5 pt-4 pb-8">
        <View className="rounded-xl border border-neutral-200 bg-white px-4 py-4 mb-6">
          <Text className="text-xs font-semibold text-neutral-500 mb-1">
            {t('settings.about.version')}
          </Text>
          <Text className="text-base text-neutral-900">{version}</Text>
        </View>

        <SettingsRow
          icon="📄"
          title={t('settings.about.terms')}
          onPress={() => openOrComingSoon(TERMS_URL)}
        />
        <SettingsRow
          icon="🔒"
          title={t('settings.about.privacy')}
          onPress={() => openOrComingSoon(PRIVACY_URL)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
