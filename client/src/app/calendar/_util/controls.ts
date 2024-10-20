import { useCallback } from 'react';

import { CalendarProps } from '../_components/Calendar';
import { useDefaultDays } from './defaultDays';
import { D1, dateStartOfWeek, dateTS } from './dateUtils';

export function useCalendarControls(props: CalendarProps) {
  const { updatePeriod, days, selectedDate } = props;

  const defaultDays = useDefaultDays();
  const daysWithDefault = days ?? defaultDays;

  const last = useCallback(
    () => updatePeriod(selectedDate - D1 * daysWithDefault),
    [selectedDate, daysWithDefault, updatePeriod],
  );
  const next = useCallback(
    () => updatePeriod(selectedDate + D1 * daysWithDefault),
    [selectedDate, daysWithDefault, updatePeriod],
  );
  const today = useCallback(() => {
    let today = dateTS(new Date());
    if (daysWithDefault === 7) today = dateStartOfWeek(today, false);
    updatePeriod(today);
  }, [daysWithDefault, updatePeriod]);

  return { last, next, today };
}
