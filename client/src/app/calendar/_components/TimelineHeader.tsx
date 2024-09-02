import { CalendarProps } from './ViewEvents';
import { dateFormat, dateTS, useDatesArray } from '../_util/dateUtils';
import { gridCols } from '../_util/grid';
import { Children } from '@/util/propTypes';

export default function TimelineHeader(props: CalendarProps) {
  const { days, updatePeriod } = props;

  const gridTemplateColumns = gridCols(days);
  const dates = useDatesArray(props);

  return (
    <>
      <TimelineHeaderFrame cols={gridTemplateColumns}>
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => updatePeriod(date)}
            className="group col-span-2 flex flex-col items-center justify-center gap-1 p-2 text-sm sm:flex-row"
          >
            <span className="uppercase">{dateFormat(date, 'ddd')}</span>
            <span
              className="flex size-7 items-center justify-center rounded-full font-bold group-hover:bg-slate-300/50 data-[td]:ml-0.5 data-[td]:bg-emerald-700 data-[td]:text-dwhite group-hover:data-[td]:bg-emerald-800"
              data-td={date === dateTS(new Date()) || null}
            >
              {dateFormat(date, 'D')}
            </span>
          </button>
        ))}
      </TimelineHeaderFrame>
    </>
  );
}

export function TimelineHeaderFrame({
  cols,
  placeholderWidth,
  children,
}: { cols?: string; placeholderWidth?: string } & Children) {
  return (
    <>
      <div
        className="flex flex-1 flex-row overflow-hidden"
        style={{ maxWidth: placeholderWidth }}
      >
        <div
          className="-m-2 mb-2 grid flex-1 grid-flow-row auto-rows-fr divide-x divide-slate-300 border-b border-slate-300 bg-dwhite p-2 shadow-sm"
          style={{ gridTemplateColumns: cols }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
