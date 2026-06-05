import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SettingsRow } from '@/src/components/settings/settings-row';
import { shadows } from '@/src/constants/shadows';
import { t } from '@/src/i18n';

// 法的文書は GitHub Pages（main /docs）で公開。ソースは docs/{terms-of-use,privacy-policy}.html。
const TERMS_URL = 'https://hohoemi-rabo.github.io/oisyasan-nabi/terms-of-use.html';
const PRIVACY_URL = 'https://hohoemi-rabo.github.io/oisyasan-nabi/privacy-policy.html';

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
        <View style={shadows.card} className="rounded-[18px] border border-line bg-surface px-4 py-4 mb-6">
          <Text className="text-xs font-bold text-ink-500 mb-1">
            {t('settings.about.version')}
          </Text>
          <Text className="text-base text-ink-900">{version}</Text>
        </View>

        <SettingsRow
          icon="document-text"
          tone="teal"
          title={t('settings.about.terms')}
          onPress={() => openOrComingSoon(TERMS_URL)}
        />
        <SettingsRow
          icon="lock-closed"
          tone="blue"
          title={t('settings.about.privacy')}
          onPress={() => openOrComingSoon(PRIVACY_URL)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
