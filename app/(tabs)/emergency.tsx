import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { DutyDoctorList } from '@/src/components/emergency/duty-doctor-list';
import { EmergencyCallButton } from '@/src/components/emergency/emergency-call-button';
import { FirstAidSteps } from '@/src/components/emergency/first-aid-steps';
import { NightClinicCard } from '@/src/components/emergency/night-clinic-card';
import { HospitalCard } from '@/src/components/hospital/hospital-card';
import { BrandColors } from '@/src/constants/colors';
import { t } from '@/src/i18n';
import { getRotationsForDate, isWeekend, todayKey } from '@/src/lib/emergency-rotations';
import { useEmergencyRotationsStore } from '@/src/stores/emergency-rotations-store';
import { useHospitalsStore } from '@/src/stores/hospitals-store';

function SectionTitle({ children }: { children: string }) {
  return <Text className="text-lg font-bold text-neutral-900 mt-6 mb-3">{children}</Text>;
}

export default function EmergencyScreen() {
  const rotations = useEmergencyRotationsStore((s) => s.data);
  const rotationsLoadedAt = useEmergencyRotationsStore((s) => s.loadedAt);
  const rotationsLoading = useEmergencyRotationsStore((s) => s.isLoading);
  const loadRotations = useEmergencyRotationsStore((s) => s.load);

  const hospitals = useHospitalsStore((s) => s.data);
  const hospitalsLoadedAt = useHospitalsStore((s) => s.loadedAt);
  const hospitalsLoading = useHospitalsStore((s) => s.isLoading);
  const loadHospitals = useHospitalsStore((s) => s.load);

  useEffect(() => {
    if (rotationsLoadedAt === null && !rotationsLoading) loadRotations();
  }, [rotationsLoadedAt, rotationsLoading, loadRotations]);

  useEffect(() => {
    if (hospitalsLoadedAt === null && !hospitalsLoading) loadHospitals();
  }, [hospitalsLoadedAt, hospitalsLoading, loadHospitals]);

  const today = new Date();
  const todaysRotations = getRotationsForDate(rotations, todayKey(today));
  const hasDutyToday = todaysRotations.length > 0;
  const weekday = !isWeekend(today);
  const emergencyHospitals = hospitals.filter((h) => h.emergency_available);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="px-5 pt-4 pb-8">
        <EmergencyCallButton />

        <SectionTitle>{t('emergency.dutyDoctor.title')}</SectionTitle>
        {hasDutyToday ? (
          <DutyDoctorList rotations={todaysRotations} />
        ) : (
          <View className="rounded-2xl border border-neutral-200 bg-white px-4 py-4">
            <Text className="text-sm text-neutral-600">
              {weekday ? t('emergency.dutyDoctor.weekday') : t('emergency.dutyDoctor.empty')}
            </Text>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('emergency.calendar.button')}
          onPress={() => router.push('/emergency/calendar')}
          className="mt-3 min-h-[56px] rounded-xl px-4 py-3 flex-row items-center bg-white border border-neutral-200 active:bg-neutral-100">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: BrandColors.info }}>
            <IconSymbol name="chevron.right" size={22} color="#ffffff" />
          </View>
          <Text className="flex-1 text-base font-semibold text-neutral-900">
            {t('emergency.calendar.button')}
          </Text>
          <IconSymbol name="chevron.right" size={20} color={BrandColors.neutral500} />
        </Pressable>

        <SectionTitle>{t('emergency.nightClinic.title')}</SectionTitle>
        <NightClinicCard emphasized={weekday && !hasDutyToday} />

        <SectionTitle>{t('emergency.firstAid.title')}</SectionTitle>
        <FirstAidSteps />

        <SectionTitle>{t('emergency.hospitals.title')}</SectionTitle>
        {emergencyHospitals.length > 0 ? (
          emergencyHospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onPress={() =>
                router.push({ pathname: '/hospital/[id]', params: { id: hospital.id } })
              }
            />
          ))
        ) : (
          <Text className="text-sm text-neutral-500 py-4 text-center">
            {t('emergency.hospitals.empty')}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
