import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/src/i18n';

type Props = {
  title: string;
  ticket: string;
};

export function ScreenPlaceholder({ title, ticket }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-bg items-center justify-center px-6">
      <Text className="text-2xl font-bold text-ink-900 mb-2">{title}</Text>
      <Text className="text-sm text-ink-500">{t('home.placeholder', { ticket })}</Text>
    </SafeAreaView>
  );
}
