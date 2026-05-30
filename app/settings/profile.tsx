import { Stack } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingOption } from '@/src/components/common/onboarding-option';
import { CITIES, OUTSIDE_AREA, type ResidentialArea } from '@/src/constants/cities';
import { t } from '@/src/i18n';
import {
  useProfileStore,
  type AgeGroup,
  type MobilityAid,
} from '@/src/stores/profile-store';

const AGE_OPTIONS: { value: AgeGroup; labelKey: 'under39' | '40to64' | '65to74' | 'over75' }[] = [
  { value: 'under39', labelKey: 'under39' },
  { value: '40to64', labelKey: '40to64' },
  { value: '65to74', labelKey: '65to74' },
  { value: 'over75', labelKey: 'over75' },
];

const MOBILITY_OPTIONS: { value: MobilityAid; labelKey: 'none' | 'cane' | 'wheelchair' }[] = [
  { value: 'none', labelKey: 'none' },
  { value: 'cane', labelKey: 'cane' },
  { value: 'wheelchair', labelKey: 'wheelchair' },
];

export default function ProfileEditScreen() {
  const ageGroup = useProfileStore((s) => s.ageGroup);
  const residentialArea = useProfileStore((s) => s.residentialArea);
  const mobilityAid = useProfileStore((s) => s.mobilityAid);
  const setAgeGroup = useProfileStore((s) => s.setAgeGroup);
  const setArea = useProfileStore((s) => s.setArea);
  const setMobilityAid = useProfileStore((s) => s.setMobilityAid);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-neutral-50">
      <Stack.Screen options={{ title: t('settings.profile.title') }} />
      <ScrollView contentContainerClassName="px-5 pt-4 pb-8">
        <Section title={t('settings.profile.age')}>
          {AGE_OPTIONS.map(({ value, labelKey }) => (
            <OnboardingOption
              key={value}
              label={t(`onboarding.age.${labelKey}`)}
              selected={ageGroup === value}
              onPress={() => setAgeGroup(value)}
            />
          ))}
        </Section>

        <Section title={t('settings.profile.area')}>
          {CITIES.map((city) => (
            <OnboardingOption
              key={city}
              label={city}
              selected={residentialArea === city}
              onPress={() => setArea(city)}
            />
          ))}
          <OnboardingOption
            label={t('onboarding.area.outsideArea')}
            selected={residentialArea === OUTSIDE_AREA}
            onPress={() => setArea(OUTSIDE_AREA satisfies ResidentialArea)}
          />
        </Section>

        <Section title={t('settings.profile.mobility')}>
          {MOBILITY_OPTIONS.map(({ value, labelKey }) => (
            <OnboardingOption
              key={value}
              label={t(`onboarding.mobility.${labelKey}`)}
              selected={mobilityAid === value}
              onPress={() => setMobilityAid(value)}
            />
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="text-sm font-semibold text-neutral-600 mb-3">{title}</Text>
      {children}
    </View>
  );
}
