import { Text, View } from 'react-native';

import { t } from '@/src/i18n';
import { formatTimeRange } from '@/src/lib/format-time';
import type { HospitalSchedule } from '@/src/types/hospital';

type Props = { schedules: HospitalSchedule[] };

const DAY_KEYS = ['0', '1', '2', '3', '4', '5', '6'] as const;

export function ScheduleTable({ schedules }: Props) {
  const byDay = new Map<number, HospitalSchedule>();
  for (const s of schedules) byDay.set(s.day_of_week, s);

  return (
    <View className="rounded-xl overflow-hidden border border-neutral-200">
      <View className="flex-row bg-neutral-100">
        <Cell flex={1} bold>
          {' '}
        </Cell>
        <Cell flex={2} bold>
          {t('hospital.schedule.morning')}
        </Cell>
        <Cell flex={2} bold>
          {t('hospital.schedule.afternoon')}
        </Cell>
      </View>
      {DAY_KEYS.map((dayKey, idx) => {
        const day = Number(dayKey);
        const s = byDay.get(day);
        const closed = !s || s.is_closed;
        const morning = s ? formatTimeRange(s.morning_start, s.morning_end) : '';
        const afternoon = s ? formatTimeRange(s.afternoon_start, s.afternoon_end) : '';
        return (
          <View
            key={dayKey}
            className={`flex-row ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
            <Cell flex={1} bold>
              {t(`hospital.schedule.day.${dayKey}`)}
            </Cell>
            {closed ? (
              <Cell flex={4} muted>
                {t('hospital.schedule.closed')}
              </Cell>
            ) : (
              <>
                <Cell flex={2} muted={!morning}>
                  {morning || '−'}
                </Cell>
                <Cell flex={2} muted={!afternoon}>
                  {afternoon || '−'}
                </Cell>
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}

function Cell({
  children,
  flex,
  bold,
  muted,
}: {
  children: React.ReactNode;
  flex: number;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <View style={{ flex }} className="px-3 py-2 border-r border-neutral-100">
      <Text
        className={`text-sm ${bold ? 'font-semibold text-neutral-900' : muted ? 'text-neutral-400' : 'text-neutral-700'}`}>
        {children}
      </Text>
    </View>
  );
}
