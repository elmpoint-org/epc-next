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
            className="group col-span-2 flex flex-col items-center justify-center gap-1 p-2 text-sm xl:flex-row"
            disabled={updatePeriod === undefined}
          >
            {/* day of week */}
            <span className="uppercase">{dateFormat(date, 'ddd')}</span>

            {/* day of month */}
            {!noDate && (
              <span
                className="flex size-7 items-center justify-center rounded-full font-bold group-hover:group-enabled:bg-slate-300/50 data-[td]:ml-0.5 data-[td]:bg-emerald-700 data-[td]:text-dwhite group-hover:group-enabled:data-[td]:bg-emerald-800"
                data-td={date === dateTS(new Date()) || null}
              >
                {dateFormat(date, 'D')}
              </span>
            )}
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
          className="-m-2 mb-2 grid flex-1 grid-flow-row auto-rows-fr divide-x divide-slate-300 border-b border-slate-300 bg-dwhite p-1 shadow-sm after:mr-1 after:border-r after:border-slate-400 after:data-[nd]:hidden"
          style={{ gridTemplateColumns: cols }}
          data-nd={children || noDivider || null} // don't show right divider
        >
          {children}
        </div>
      </div>
    </>
  );
}
