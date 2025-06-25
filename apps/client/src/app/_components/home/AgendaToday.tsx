'use client';

import { lazy } from 'react';

import { IconLoader2 } from '@tabler/icons-react';

import { useGraphQuery } from '@/query/query';
import {
  EVENTS_QUERY,
  InvalidateProvider,
} from '@/app/calendar/_components/Calendar';
import { dateTS } from '@epc/date-ts';

const Agenda = lazy(() => import('@/app/calendar/_components/Agenda'));

export default function AgendaToday() {
  // get calendar data
  const today = dateTS(new Date());
  const dates = { start: today, end: today };
  const query = useGraphQuery(EVENTS_QUERY, dates);

  return (
    <div className="min-h-48 px-2.5">
      {/* loader */}
      {query.isPending && (
        <div className="flex flex-row items-center justify-center">
          <IconLoader2 className="animate-spin text-slate-400" />
        </div>
      )}

      {/* data */}
      {query.data?.stays && (
        <InvalidateProvider cb={() => query.refetch()}>
          <Agenda
            events={query.data.stays}
            dates={dates}
            days={1}
            updatePeriod={() => {}}
          />
        </InvalidateProvider>
      )}
    </div>
  );
}
