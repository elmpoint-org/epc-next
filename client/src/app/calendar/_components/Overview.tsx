'use client';

import { useCallback, useEffect, useState } from 'react';

import { D1 } from '../_util/dateUtils';
import type { CalendarProps } from './Calendar';
import {
  GlobalKeyboardHandler,
  useGlobalKeyboardShortcuts,
} from '@/app/_ctx/globalKeyboard';

import OverviewCalendar from './OverviewCalendar';
import OverviewDay from './OverviewDay';

export const OVERVIEW_NUM_WEEKS = 6;

// COMPONENT
export default function Overview({ ...props }: CalendarProps) {
  const { dates: queryDates } = props;

  // selected date
  const state_selectedDate = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = state_selectedDate;
  useEffect(() => {
    if (
      selectedDate &&
      (selectedDate < queryDates.start || selectedDate >= queryDates.end)
    )
      setSelectedDate(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDates]);

  // KEYBOARD SHORTCUTS
  const keyboardHandler = useCallback<GlobalKeyboardHandler>(
    (e, { withModifiers }) => {
      if (withModifiers) return;

      const modifyDate = (days: number) => {
        let d = selectedDate;
        if (!d) d = 0;
        d = d + days * D1;
        if (d < queryDates.start) d = queryDates.start;
        if (d >= queryDates.end) d = queryDates.end - D1;
        setSelectedDate(d);
      };

      switch (e.code) {
        case 'ArrowLeft':
          e.preventDefault();
          modifyDate(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          modifyDate(1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          modifyDate(7);
          break;
        case 'ArrowUp':
          e.preventDefault();
          modifyDate(-7);
          break;
      }
    },
    [queryDates.end, queryDates.start, selectedDate, setSelectedDate],
  );
  useGlobalKeyboardShortcuts(keyboardHandler);

  // RENDER
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="relative flex flex-col gap-4 md:flex-row">
          {/* calendar */}
          <OverviewCalendar selected={state_selectedDate} {...props} />

          {/* selected day panel */}
          <OverviewDay selected={state_selectedDate} {...props} />
        </div>
      </div>
    </>
  );
}
