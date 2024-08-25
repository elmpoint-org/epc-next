import { useDatesArray } from '../_util/dateUtils';
import { CalendarProps } from './ViewEvents';
import { gridCols } from '../_util/grid';

import TimelineHeader from './TimelineHeader';
import TimelineEvent from './TimelineEvent';

export default function ViewTimeline(props: CalendarProps) {
  const { events, days } = props;

  // ctx hooks
  const dates = useDatesArray(props);
  const gridTemplateColumns = gridCols(days);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="border-t border-slate-300" />
        <div className="relative flex min-h-96 flex-col">
          {/* divider lines */}
          <div
            className="absolute inset-0 grid divide-x divide-slate-300 "
            style={{ gridTemplateColumns }}
          >
            {dates.map((_, i) => (
              <div key={i} className="col-span-2" />
            ))}
          </div>

          {/* header */}
          <TimelineHeader {...props} />

          {/* events grid */}
          <div
            className="z-40 grid grid-flow-row-dense auto-rows-fr gap-2"
            style={{ gridTemplateColumns }}
          >
            {events?.map((event) => (
              <TimelineEvent key={event.id} event={event} {...props} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
