import { Pressable, Text, View } from 'react-native';

import { t } from '@/src/i18n';
import { groupByType } from '@/src/lib/emergency-rotations';
import { formatTimeRange } from '@/src/lib/format-time';
import { callPhone } from '@/src/lib/linking';
import type { EmergencyRotation } from '@/src/types/emergency';

type Props = {
  rotations: EmergencyRotation[];
};

// 当番医セクション + カレンダー日付詳細モーダルで共用。空配列の扱いは呼び出し側。
export function DutyDoctorList({ rotations }: Props) {
  const groups = groupByType(rotations);

  return (
    <View>
      {groups.map((group) => (
        <View key={group.type} className="mb-3">
          <Text className="text-sm font-bold text-neutral-500 mb-2">
            {t(`emergency.types.${group.type}` as 'emergency.types.duty_doctor')}
          </Text>
          {group.items.map((item) => (
            <DutyRow key={item.id} rotation={item} />
          ))}
        </View>
      ))}
    </View>
  );
}

function DutyRow({ rotation }: { rotation: EmergencyRotation }) {
  const time = formatTimeRange(rotation.start_time, rotation.end_time);
  const subParts = [rotation.department, rotation.area].filter(Boolean);

  return (
    <View className="bg-white rounded-xl border border-neutral-200 px-4 py-3 mb-2">
      <View className="flex-row items-center flex-wrap mb-1">
        <Text className="text-base font-bold text-neutral-900 mr-2">{rotation.facility_name}</Text>
        {subParts.length > 0 ? (
          <Text className="text-xs text-neutral-500">{subParts.join('・')}</Text>
        ) : null}
      </View>
      {time ? <Text className="text-sm text-neutral-600">{time}</Text> : null}
      {rotation.note ? (
        <Text className="text-xs text-amber-700 mt-1">
          {t('emergency.note')}: {rotation.note}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${rotation.facility_name} ${t('emergency.dutyDoctor.callButton')}`}
        onPress={() => callPhone(rotation.phone)}
        className="mt-2 min-h-[44px] flex-row items-center justify-center rounded-xl bg-blue-600 active:bg-blue-700">
        <Text className="text-base mr-1">📞</Text>
        <Text className="text-sm font-semibold text-white">
          {t('emergency.dutyDoctor.callButton')}（{rotation.phone}）
        </Text>
      </Pressable>
    </View>
  );
}
