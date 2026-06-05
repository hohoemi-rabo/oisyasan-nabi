import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingOption } from '@/src/components/common/onboarding-option';
import { OnboardingProgress } from '@/src/components/common/onboarding-progress';
import { t } from '@/src/i18n';
import { useProfileStore, type AgeGroup } from '@/src/stores/profile-store';

const AGE_OPTIONS: { value: AgeGroup; labelKey: 'under39' | '40to64' | '65to74' | 'over75' }[] = [
  { value: 'under39', labelKey: 'under39' },
  { value: '40to64', labelKey: '40to64' },
  { value: '65to74', labelKey: '65to74' },
  { value: 'over75', labelKey: 'over75' },
];

export default function OnboardingAgeScreen() {
  const setAgeGroup = useProfileStore((s) => s.setAgeGroup);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);
  const currentAgeGroup = useProfileStore((s) => s.ageGroup);

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSelect = (value: AgeGroup) => {
    setAgeGroup(value);
    router.push('/onboarding/area');
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

      <OnboardingProgress current={2} />

      <View className="px-6 pt-2 pb-4">
        <Text className="text-2xl font-bold text-ink-900 mb-2">
          {t('onboarding.age.title')}
        </Text>
        <Text className="text-sm text-ink-500">{t('onboarding.age.description')}</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {AGE_OPTIONS.map(({ value, labelKey }) => (
          <OnboardingOption
            key={value}
            label={t(`onboarding.age.${labelKey}`)}
            selected={currentAgeGroup === value}
            onPress={() => handleSelect(value)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
