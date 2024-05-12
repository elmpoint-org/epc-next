import { useMemo } from 'react';
import dayjs from 'dayjs';

import { COST_GUESTS, COST_MEMBERS } from './Form';
import { useFormCtx } from '../state/formCtx';

const DateStats = () => {
  const { dates } = useFormCtx();

  const diff = useMemo(() => {
    const d = dayjs(dates[1]).diff(dayjs(dates[0]), 'days') + 1;
    return Number.isFinite(d) ? Math.abs(d) : 0;
  }, [dates]);

  return (
    <>
      <div className="flex flex-row justify-end pb-4">
        <p className="text-sm text-slate-600">
          {`${diff} day${diff !== 1 ? 's':''} - \$${diff * COST_MEMBERS}/member - \$${diff * COST_GUESTS}/guest`}
        </p>
      </div>
    </>
  );
};
export default DateStats;
