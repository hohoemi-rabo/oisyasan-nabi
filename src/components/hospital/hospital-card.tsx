import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { DeptTag } from '@/src/components/hospital/dept-tag';
import { StatusPill } from '@/src/components/hospital/status-pill';
import { colors } from '@/src/constants/colors';
import { deptAccentColor } from '@/src/constants/dept-colors';
import { shadows } from '@/src/constants/shadows';
import { isCurrentlyOpen } from '@/src/lib/is-currently-open';
import type { Hospital } from '@/src/types/hospital';

const MAX_TAGS = 4;

type Props = {
  hospital: Hospital;
  matchedDepartments?: string[];
  onPress: () => void;
};

// 病院カード（DESIGN-GUIDELINES.md §5.2）。左アクセントバー + 診療科色分け + 営業状態ピル。
export function HospitalCard({ hospital, matchedDepartments = [], onPress }: Props) {
  const open = isCurrentlyOpen(hospital);
  const visibleTags = hospital.category.slice(0, MAX_TAGS);
  const remaining = hospital.category.length - visibleTags.length;
  const matched = new Set(matchedDepartments);
  const accent = deptAccentColor(hospital.category[0] ?? '内科');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={hospital.name}
      onPress={onPress}
      style={shadows.card}
      className="bg-surface rounded-[18px] border border-line px-4 py-4 mb-3 active:opacity-90 overflow-hidden">
      {/* 左端アクセントバー（主診療科の色） */}
      <View
        style={{ backgroundColor: accent, position: 'absolute', left: 0, top: 18, bottom: 18, width: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4 }}
      />

      <View className="flex-row items-start justify-between mb-2">
        <Text className="flex-1 text-[17px] font-bold text-ink-900 mr-2" numberOfLines={2}>
          {hospital.name}
        </Text>
        <StatusPill isOpen={open} />
      </View>

      {visibleTags.length > 0 ? (
        <View className="flex-row flex-wrap mb-2">
          {visibleTags.map((tag) => (
            <DeptTag key={tag} name={tag} matched={matched.has(tag)} />
          ))}
          {remaining > 0 ? (
            <Text className="text-xs text-ink-400 self-center">+{remaining}</Text>
          ) : null}
        </View>
      ) : null}

      <View className="flex-row items-center">
        <Ionicons name="location-outline" size={15} color={colors.ink[400]} />
        <Text className="flex-1 ml-1.5 text-[12.5px] font-medium text-ink-500" numberOfLines={1}>
          {hospital.city}
          {hospital.address ? `  ${hospital.address}` : ''}
        </Text>
      </View>
    </Pressable>
  );
}
