import { useMemo } from 'react';
import dayjs from 'dayjs';

import {
  DAILY_HEAD_TAX_GUESTS,
  DAILY_HEAD_TAX_MEMBERS,
} from '@/data/headTaxData';
import { useFormCtx } from '../state/formCtx';

const DAYS_MAX = 150;

const DateStats = () => {
  const { dates } = useFormCtx();

  const diff = useMemo(() => {
    const d = dayjs(dates[1]).diff(dayjs(dates[0]), 'days');
    if (!Number.isFinite(d)) return 0;
    return Math.abs(d);
  }, [dates]);
  const diffLim = useMemo(() => Math.min(diff, DAYS_MAX), [diff]);
  const isMax = diff > diffLim;

  const memberCost = useMemo(() => diffLim * DAILY_HEAD_TAX_MEMBERS, [diffLim]);
  const guestCost = useMemo(() => diffLim * DAILY_HEAD_TAX_GUESTS, [diffLim]);

  return (
    <>
      <div className="flex flex-row justify-end pb-4">
        <p className="text-sm text-slate-600">
          {`${diffLim}${isMax ? '+' : ''} night${diffLim !== 1 ? 's' : ''} - `}
          {!isMax && `\$${memberCost}/member - \$${guestCost}/guest`}
          {isMax && `$???/member - $???/guest`}
        </p>
      </div>
    </>
  );
};
export default DateStats;
