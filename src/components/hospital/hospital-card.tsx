import { Pressable, Text, View } from 'react-native';

import { isCurrentlyOpen } from '@/src/lib/is-currently-open';
import { t } from '@/src/i18n';
import type { Hospital } from '@/src/types/hospital';

const MAX_TAGS = 4;

type Props = {
  hospital: Hospital;
  matchedDepartments?: string[];
  onPress: () => void;
};

export function HospitalCard({ hospital, matchedDepartments = [], onPress }: Props) {
  const open = isCurrentlyOpen(hospital);
  const visibleTags = hospital.category.slice(0, MAX_TAGS);
  const remaining = hospital.category.length - visibleTags.length;
  const matched = new Set(matchedDepartments);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={hospital.name}
      onPress={onPress}
      className="bg-white rounded-2xl border border-neutral-200 px-4 py-4 mb-3 active:bg-neutral-50">
      <View className="flex-row items-center flex-wrap mb-2">
        <Text className="text-lg font-bold text-neutral-900 mr-2">{hospital.name}</Text>
        <View
          accessibilityRole="text"
          accessibilityLabel={open ? t('search.results.openNow') : t('search.results.closed')}
          className={`px-2 py-0.5 rounded-full ${open ? 'bg-green-100' : 'bg-neutral-100'}`}>
          <Text
            className={`text-xs font-semibold ${
              open ? 'text-green-700' : 'text-neutral-500'
            }`}>
            {open ? `● ${t('search.results.openNow')}` : `○ ${t('search.results.closed')}`}
          </Text>
        </View>
      </View>

      {visibleTags.length > 0 ? (
        <View className="flex-row flex-wrap mb-2">
          {visibleTags.map((tag) => {
            const highlighted = matched.has(tag);
            return (
              <View
                key={tag}
                className={`px-2 py-0.5 rounded-full mr-1.5 mb-1 ${
                  highlighted ? 'bg-blue-100' : 'bg-neutral-100'
                }`}>
                <Text
                  className={`text-xs ${
                    highlighted ? 'text-blue-700 font-semibold' : 'text-neutral-600'
                  }`}>
                  {tag}
                </Text>
              </View>
            );
          })}
          {remaining > 0 ? (
            <Text className="text-xs text-neutral-500 self-center">+{remaining}</Text>
          ) : null}
        </View>
      ) : null}

      <Text className="text-sm text-neutral-500">
        {hospital.city}
        {hospital.address ? `  ${hospital.address}` : ''}
      </Text>
    </Pressable>
  );
}
