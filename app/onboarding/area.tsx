import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingOption } from '@/src/components/common/onboarding-option';
import { OnboardingProgress } from '@/src/components/common/onboarding-progress';
import {
  CITIES,
  OUTSIDE_AREA,
  type ResidentialArea,
} from '@/src/constants/cities';
import { t } from '@/src/i18n';
import { useProfileStore } from '@/src/stores/profile-store';

export default function OnboardingAreaScreen() {
  const setArea = useProfileStore((s) => s.setArea);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);
  const currentArea = useProfileStore((s) => s.residentialArea);

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSelect = (value: ResidentialArea) => {
    setArea(value);
    router.push('/onboarding/mobility');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-row justify-end px-4 pt-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('onboarding.common.skip')}
          onPress={handleSkip}
          className="min-h-[44px] px-3 justify-center">
          <Text className="text-sm text-neutral-500">{t('onboarding.common.skip')}</Text>
        </Pressable>
      </View>

      <OnboardingProgress current={3} />

      <View className="px-6 pt-2 pb-4">
        <Text className="text-2xl font-bold text-neutral-900 mb-2">
          {t('onboarding.area.title')}
        </Text>
        <Text className="text-sm text-neutral-600">{t('onboarding.area.description')}</Text>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerClassName="pb-6">
        {CITIES.map((city) => (
          <OnboardingOption
            key={city}
            label={city}
            selected={currentArea === city}
            onPress={() => handleSelect(city)}
          />
        ))}
        <OnboardingOption
          key={OUTSIDE_AREA}
          label={t('onboarding.area.outsideArea')}
          selected={currentArea === OUTSIDE_AREA}
          onPress={() => handleSelect(OUTSIDE_AREA)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
