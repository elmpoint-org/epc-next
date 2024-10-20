import { useCallback } from 'react';

import { CalendarProps } from '../_components/Calendar';
import { useDefaultDays } from './defaultDays';
import { D1, dateStartOfWeek, dateTS, dateTSObject } from './dateUtils';
import { useCalendarView } from './displayByRooms';

export function useCalendarControls(props: CalendarProps) {
  const { updatePeriod, days, selectedDate } = props;

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

  return { last, next, today };
}
