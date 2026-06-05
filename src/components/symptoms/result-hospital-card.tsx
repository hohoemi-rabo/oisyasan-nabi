import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import { HospitalCard } from '@/src/components/hospital/hospital-card';
import { colors } from '@/src/constants/colors';
import { t } from '@/src/i18n';
import { callPhone, openGoogleMaps } from '@/src/lib/linking';
import type { Hospital } from '@/src/types/hospital';

type Props = {
  hospital: Hospital;
  matchedDepartments: string[];
};

// 検索結果カードに加え、症状結果では各カードに「電話 / 地図 / 詳細」ボタンを付ける
// （REQUIREMENTS §3.3.2）。
export function ResultHospitalCard({ hospital, matchedDepartments }: Props) {
  const goDetail = () =>
    router.push({ pathname: '/hospital/[id]', params: { id: hospital.id } });

  return (
    <View className="mb-3">
      <HospitalCard
        hospital={hospital}
        matchedDepartments={matchedDepartments}
        onPress={goDetail}
      />
      <View className="flex-row gap-2 -mt-1">
        {hospital.tel ? (
          <ActionButton
            label={t('symptoms.result.actions.call')}
            icon="call"
            onPress={() => callPhone(hospital.tel)}
          />
        ) : null}
        <ActionButton
          label={t('symptoms.result.actions.map')}
          icon="map"
          onPress={() =>
            openGoogleMaps({
              latitude: hospital.latitude,
              longitude: hospital.longitude,
              address: hospital.address,
              googleMapUrl: hospital.google_map_url,
            })
          }
        />
        <ActionButton label={t('symptoms.result.actions.detail')} icon="document-text" onPress={goDetail} />
      </View>
    </View>
  );
}

function ActionButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="flex-1 min-h-[48px] flex-row items-center justify-center rounded-xl border border-line bg-surface active:opacity-90">
      <Ionicons name={icon} size={16} color={colors.ink[700]} />
      <Text className="ml-1 text-xs font-bold text-ink-700">{label}</Text>
    </Pressable>
  );
}
