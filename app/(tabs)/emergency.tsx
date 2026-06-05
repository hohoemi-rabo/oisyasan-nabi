import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DutyDoctorList } from '@/src/components/emergency/duty-doctor-list';
import { EmergencyCallButton } from '@/src/components/emergency/emergency-call-button';
import { FirstAidSteps } from '@/src/components/emergency/first-aid-steps';
import { NightClinicCard } from '@/src/components/emergency/night-clinic-card';
import { HospitalCard } from '@/src/components/hospital/hospital-card';
import { colors } from '@/src/constants/colors';
import { coloredShadow, shadows } from '@/src/constants/shadows';
import { t } from '@/src/i18n';
import { getRotationsForDate, isWeekend, todayKey } from '@/src/lib/emergency-rotations';
import { useEmergencyRotationsStore } from '@/src/stores/emergency-rotations-store';
import { useHospitalsStore } from '@/src/stores/hospitals-store';

function SectionTitle({
  icon,
  color,
  children,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  color: string;
  children: string;
}) {
  return (
    <View className="flex-row items-center mt-6 mb-3">
      <Ionicons name={icon} size={18} color={color} />
      <Text className="ml-2 text-[16px] font-bold text-ink-900">{children}</Text>
    </View>
  );
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
      <ScrollView contentContainerClassName="px-[18px] pt-4 pb-8">
        <EmergencyCallButton />

        <SectionTitle icon="calendar" color={colors.red[600]}>
          {t('emergency.dutyDoctor.title')}
        </SectionTitle>
        {hasDutyToday ? (
          <DutyDoctorList rotations={todaysRotations} />
        ) : (
          <View style={shadows.card} className="rounded-[18px] border border-line bg-surface px-4 py-4">
            <Text className="text-sm text-ink-500 leading-relaxed">
              {weekday ? t('emergency.dutyDoctor.weekday') : t('emergency.dutyDoctor.empty')}
            </Text>
          </View>
        )}

        {/* 今月のカレンダーを見る */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('emergency.calendar.button')}
          onPress={() => router.push('/emergency/calendar')}
          style={shadows.card}
          className="mt-3 min-h-[56px] rounded-[18px] px-4 py-[15px] flex-row items-center bg-surface active:opacity-90">
          <View
            style={[{ backgroundColor: colors.blue[600] }, coloredShadow(colors.blue[600])]}
            className="w-10 h-10 rounded-xl items-center justify-center mr-3">
            <Ionicons name="calendar" size={20} color="#fff" />
          </View>
          <Text className="flex-1 text-[15px] font-bold text-ink-900">
            {t('emergency.calendar.button')}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.ink[300]} />
        </Pressable>

        <SectionTitle icon="moon" color={colors.blue[600]}>
          {t('emergency.nightClinic.title')}
        </SectionTitle>
        <NightClinicCard />

        <SectionTitle icon="medkit" color={colors.teal[600]}>
          {t('emergency.firstAid.title')}
        </SectionTitle>
        <FirstAidSteps />

        <SectionTitle icon="medical" color={colors.red[600]}>
          {t('emergency.hospitals.title')}
        </SectionTitle>
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
          <Text className="text-sm text-ink-400 py-4 text-center">
            {t('emergency.hospitals.empty')}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
