import { CalendarProps } from './Calendar';
import { dateFormat, dateTS } from '@epc/date-ts';
import { useDatesArray } from '../_util/datesArray';
import { gridCols } from '../_util/grid';
import { Children } from '@/util/propTypes';

type TimelineHeaderProps = Pick<CalendarProps, 'days' | 'dates'> & {
  updatePeriod?: CalendarProps['updatePeriod'];
  noDate?: boolean;
};
export default function TimelineHeader({
  noDate,
  ...props
}: TimelineHeaderProps) {
  const { days, updatePeriod } = props;

  const gridTemplateColumns = gridCols(days);
  const dates = useDatesArray(props);

  return (
    <>
      <TimelineHeaderFrame cols={gridTemplateColumns}>
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => updatePeriod?.(date)}
            className="group @container/day col-span-2 p-2 text-sm first:ml-px"
            disabled={updatePeriod === undefined}
          >
            <div className="flex flex-col items-center justify-center gap-1 @[4rem]/day:flex-row">
              {/* day of week */}
              <span className="uppercase">{dateFormat(date, 'ddd')}</span>

              {/* day of month */}
              {!noDate && (
                <span
                  className="flex size-7 items-center justify-center rounded-full font-bold group-enabled:group-hover:bg-slate-300/50 data-td:ml-0.5 data-td:bg-emerald-700 data-td:text-dwhite data-td:group-enabled:group-hover:bg-emerald-800"
                  data-td={date === dateTS(new Date()) || null}
                >
                  {dateFormat(date, 'D')}
                </span>
              )}
            </div>
          </button>
        ))}
      </TimelineHeaderFrame>
    </>
  );
}

export function TimelineHeaderFrame({
  cols,
  placeholderWidth,
  noDivider,
  children,
}: {
  cols?: string;
  placeholderWidth?: string;
  noDivider?: boolean;
} & Children) {
  return (
    <>
      <div
        className="flex flex-1 flex-row overflow-hidden"
        style={{ maxWidth: placeholderWidth, minWidth: placeholderWidth }}
      >
        <div
          className="-m-2 mb-2 grid flex-1 grid-flow-row auto-rows-fr divide-x divide-slate-300 border-b border-slate-300 bg-dwhite p-1 shadow-xs after:mr-1 after:border-r after:border-slate-400 data-nd:after:hidden"
          style={{ gridTemplateColumns: cols }}
          data-nd={!!children || noDivider || null} // don't show right divider
        >
          {children}
        </div>
      </div>
    </>
  );
}
