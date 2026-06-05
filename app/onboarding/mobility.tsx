import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingOption } from '@/src/components/common/onboarding-option';
import { OnboardingProgress } from '@/src/components/common/onboarding-progress';
import { t } from '@/src/i18n';
import { useProfileStore, type MobilityAid } from '@/src/stores/profile-store';

const MOBILITY_OPTIONS: { value: MobilityAid; labelKey: 'none' | 'cane' | 'wheelchair' }[] = [
  { value: 'none', labelKey: 'none' },
  { value: 'cane', labelKey: 'cane' },
  { value: 'wheelchair', labelKey: 'wheelchair' },
];

export default function OnboardingMobilityScreen() {
  const setMobilityAid = useProfileStore((s) => s.setMobilityAid);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);
  const currentMobility = useProfileStore((s) => s.mobilityAid);

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSelect = (value: MobilityAid) => {
    setMobilityAid(value);
    completeOnboarding();
    router.replace('/(tabs)');
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

      <OnboardingProgress current={4} />

      <View className="px-6 pt-2 pb-4">
        <Text className="text-2xl font-bold text-ink-900 mb-2">
          {t('onboarding.mobility.title')}
        </Text>
        <Text className="text-sm text-ink-500">{t('onboarding.mobility.description')}</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {MOBILITY_OPTIONS.map(({ value, labelKey }) => (
          <OnboardingOption
            key={value}
            label={t(`onboarding.mobility.${labelKey}`)}
            selected={currentMobility === value}
            onPress={() => handleSelect(value)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
