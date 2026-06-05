import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/src/i18n';
import { useProfileStore } from '@/src/stores/profile-store';

export default function OnboardingWelcomeScreen() {
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleStart = () => {
    router.push('/onboarding/age');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-row justify-end px-4 pt-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('onboarding.common.skip')}
          onPress={handleSkip}
          className="min-h-[44px] px-3 justify-center">
          <Text className="text-sm text-ink-500">{t('onboarding.common.skip')}</Text>
        </Pressable>
      </View>

      <View className="flex-1 px-6 justify-center">
        <Text className="text-3xl font-bold text-ink-900 mb-4">
          {t('onboarding.welcome.title')}
        </Text>
        <Text className="text-base text-ink-500 leading-relaxed mb-10">
          {t('onboarding.welcome.description')}
        </Text>
      </View>

      <View className="px-6 pb-8">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('onboarding.welcome.startButton')}
          onPress={handleStart}
          className="min-h-[56px] bg-blue-600 active:bg-blue-700 rounded-xl items-center justify-center">
          <Text className="text-base font-semibold text-white">
            {t('onboarding.welcome.startButton')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
