import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { CalendarProps, QP } from '../_components/Calendar';
import { useDefaultDays } from './defaultDays';
import { D1, dateStartOfWeek, dateTS, dateTSObject } from './dateUtils';
import { ViewType, useCalendarView } from './queryStates';

export function useCalendarControls(props: CalendarProps) {
  const { updatePeriod, days, selectedDate } = props;

  const sq = useSearchParams();
  const router = useRouter();

  const [view] = useCalendarView();
  const defaultDays = useDefaultDays();
  const daysWithDefault = days ?? defaultDays;

  // ACTIONS

  const last = useCallback(() => {
    let np = selectedDate - D1 * daysWithDefault;
    if (view === 'OVERVIEW')
      np = dateTSObject(selectedDate).subtract(1, 'month').unix();
    updatePeriod(np);
  }, [selectedDate, daysWithDefault, view, updatePeriod]);

  const next = useCallback(() => {
    let np = selectedDate + D1 * daysWithDefault;
    if (view === 'OVERVIEW')
      np = dateTSObject(selectedDate).add(1, 'month').unix();
    updatePeriod(np);
  }, [selectedDate, daysWithDefault, view, updatePeriod]);

  const today = useCallback(() => {
    let today = dateTS(new Date());
    if (daysWithDefault === 7) today = dateStartOfWeek(today, false);
    updatePeriod(today);
  }, [daysWithDefault, updatePeriod]);

  const showWeekOf = useCallback(
    (date: number) => {
      const ds = dateTSObject(date).startOf('week').unix();

      const url = new URLSearchParams(sq);
      url.set('date' satisfies QP, '' + ds);
      url.set('days' satisfies QP, '' + 7);
      url.set('view' satisfies QP, 'TIMELINE' satisfies ViewType);

      router.push('?' + url.toString());
    },
    [router, sq],
  );

  return { last, next, today, showWeekOf };
}
