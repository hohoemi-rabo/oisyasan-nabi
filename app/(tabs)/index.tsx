import { Text, View } from 'react-native';

import { t } from '@/src/i18n';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-neutral-900">{t('home.title')}</Text>
      <Text className="mt-2 text-base text-neutral-500">{t('home.setupComplete')}</Text>
    </View>
  );
}
