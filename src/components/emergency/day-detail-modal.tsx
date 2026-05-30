import { format, parseISO } from 'date-fns';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DutyDoctorList } from '@/src/components/emergency/duty-doctor-list';
import { t } from '@/src/i18n';
import { getRotationsForDate } from '@/src/lib/emergency-rotations';
import type { EmergencyRotation } from '@/src/types/emergency';

type Props = {
  visible: boolean;
  dateKey: string | null;
  rotations: EmergencyRotation[];
  onClose: () => void;
};

export function DayDetailModal({ visible, dateKey, rotations, onClose }: Props) {
  const dayRotations = dateKey ? getRotationsForDate(rotations, dateKey) : [];
  const heading = dateKey ? format(parseISO(dateKey), 'yyyy年M月d日') : '';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <SafeAreaView edges={['bottom']} className="bg-neutral-50 rounded-t-2xl max-h-[80%]">
          <View className="flex-row items-center justify-between px-5 py-3 border-b border-neutral-200">
            <Text className="text-lg font-bold text-neutral-900">{heading}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('emergency.dayDetail.close')}
              onPress={onClose}
              className="min-h-[44px] min-w-[44px] items-end justify-center">
              <Text className="text-base font-semibold text-blue-600">
                {t('emergency.dayDetail.close')}
              </Text>
            </Pressable>
          </View>
          <ScrollView contentContainerClassName="px-5 py-4">
            {dayRotations.length > 0 ? (
              <DutyDoctorList rotations={dayRotations} />
            ) : (
              <Text className="text-sm text-neutral-500 py-6 text-center">
                {t('emergency.dayDetail.empty')}
              </Text>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
