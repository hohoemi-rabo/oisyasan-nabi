import { Stack } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig, type DateData } from 'react-native-calendars';

import { DayDetailModal } from '@/src/components/emergency/day-detail-modal';
import { colors } from '@/src/constants/colors';
import { shadows } from '@/src/constants/shadows';
import { t } from '@/src/i18n';
import { getDutyDateKeys } from '@/src/lib/emergency-rotations';
import { useEmergencyRotationsStore } from '@/src/stores/emergency-rotations-store';

LocaleConfig.locales.ja = {
  monthNames: [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月',
  ],
  monthNamesShort: [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月',
  ],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
  today: '今日',
};
LocaleConfig.defaultLocale = 'ja';

export default function EmergencyCalendarScreen() {
  const rotations = useEmergencyRotationsStore((s) => s.data);
  const loadedAt = useEmergencyRotationsStore((s) => s.loadedAt);
  const isLoading = useEmergencyRotationsStore((s) => s.isLoading);
  const load = useEmergencyRotationsStore((s) => s.load);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (loadedAt === null && !isLoading) load();
  }, [loadedAt, isLoading, load]);

  const markedDates = useMemo(() => {
    const marks: Record<string, { marked?: boolean; dotColor?: string; selected?: boolean; selectedColor?: string }> = {};
    for (const key of getDutyDateKeys(rotations)) {
      marks[key] = { marked: true, dotColor: colors.red[600] };
    }
    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: colors.teal[600],
      };
    }
    return marks;
  }, [rotations, selectedDate]);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg">
      <Stack.Screen options={{ title: t('emergency.calendar.title') }} />
      <View className="px-[18px] pt-4">
        <View style={shadows.card} className="rounded-[18px] border border-line bg-surface overflow-hidden p-1">
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDayPress}
            enableSwipeMonths
            theme={{
              todayTextColor: colors.teal[600],
              arrowColor: colors.teal[600],
              textMonthFontWeight: 'bold',
              textSectionTitleColor: colors.ink[500],
              monthTextColor: colors.ink[900],
              dayTextColor: colors.ink[900],
              textDisabledColor: colors.ink[300],
            }}
          />
        </View>
      </View>
      <DayDetailModal
        visible={modalVisible}
        dateKey={selectedDate}
        rotations={rotations}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
