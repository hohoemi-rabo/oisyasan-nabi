import { Text, View } from 'react-native';

import { t } from '@/src/i18n';
import type { Hospital } from '@/src/types/hospital';

type Props = { hospital: Hospital };

export function FacilityBadges({ hospital }: Props) {
  const items: { key: string; label: string }[] = [];
  if (hospital.barrier_free) items.push({ key: 'bf', label: t('hospital.facilities.barrierFree') });
  if (hospital.parking) {
    const cap = hospital.parking_capacity;
    items.push({
      key: 'pk',
      label:
        cap && cap > 0
          ? `${t('hospital.facilities.parking')} ${t('hospital.facilities.parkingCapacity', { count: cap })}`
          : t('hospital.facilities.parking'),
    });
  }
  if (hospital.emergency_available)
    items.push({ key: 'em', label: t('hospital.facilities.emergency') });
  if (hospital.shuttle_bus)
    items.push({ key: 'sb', label: t('hospital.facilities.shuttleBus') });
  if (hospital.online_consultation)
    items.push({ key: 'oc', label: t('hospital.facilities.onlineConsultation') });

  if (items.length === 0) return null;

  return (
    <View>
      <Text className="text-sm font-semibold text-neutral-600 mb-2">
        {t('hospital.facilities.title')}
      </Text>
      <View className="flex-row flex-wrap">
        {items.map((item) => (
          <View
            key={item.key}
            className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-xs font-semibold text-blue-700">✓ {item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
