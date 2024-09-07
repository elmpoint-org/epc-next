import { lazy } from 'react';

import { theme } from '@/util/tailwindVars';
import { LayoutGroup } from 'framer-motion';

import { useDatesArray } from '../_util/dateUtils';
import { CalendarProps } from './ViewEvents';
import { gridCols } from '../_util/grid';
import { useGetRooms } from '../new/state/getRoomData';
import { useDisplayByRooms } from '../_util/displayByRooms';

import TimelineHeader, { TimelineHeaderFrame } from './TimelineHeader';

const TimelineRoomRow = lazy(() => import('./TimelineRoomRow'));
const TimelineEventsGrid = lazy(() => import('./TimelineEventsGrid'));

export default function Timeline(props: CalendarProps) {
  const { days } = props;

  // ctx hooks
  const dates = useDatesArray(props);
  const gridTemplateColumns = gridCols(days);

  // get byRoom option
  const [displayByRoom] = useDisplayByRooms();

  // prep cabin sidebar
  const { initialOptions: rootCabins } = useGetRooms();
  const sidebarWidth = displayByRoom ? '14rem' : '0';

  return (
    <>
      <div
        className="group/tm flex flex-row gap-4"
        data-d={displayByRoom || null}
      >
        {/* events area */}
        <div className="flex flex-1 flex-col gap-2">
          <hr className="border-slate-300" />
          <LayoutGroup>
            <div className="relative flex min-h-96 flex-col">
              {/* divider lines */}
              <div
                className="absolute inset-0 -mx-1 grid divide-x divide-slate-300 group-data-[d]/tm:ml-1"
                style={{ gridTemplateColumns, left: sidebarWidth }}
              >
                {dates.map((_, i) => (
                  <div key={i} className="col-span-2" />
                ))}
              </div>

              {/* header */}
              <div className="sticky top-2 z-50 flex flex-row after:absolute after:inset-x-0 after:-top-2 after:h-2 after:bg-dwhite">
                <TimelineHeaderFrame placeholderWidth={sidebarWidth} />
                {displayByRoom && (
                  <TimelineHeaderFrame placeholderWidth="0.5rem" noDivider />
                )}
                <TimelineHeader {...props} />
              </div>

              {/* events grid */}
              <div
                className="z-40 flex flex-col"
                style={
                  { '--row-color': theme.colors.dwhite } as React.CSSProperties
                }
              >
                {/* show by room */}
                {displayByRoom && (
                  <>
                    {/* room rows */}
                    {rootCabins.map((rc) => (
                      <TimelineRoomRow
                        key={rc.id}
                        roomOrCabin={rc}
                        width={sidebarWidth}
                        {...props}
                      />
                    ))}

                    {/* no room  */}
                    <TimelineRoomRow
                      roomOrCabin={null}
                      width={sidebarWidth}
                      {...props}
                    />
                  </>
                )}
                {/* show disorganized */}
                {!displayByRoom && <TimelineEventsGrid {...props} />}
              </div>
            </div>
          </LayoutGroup>

          <hr className="border-slate-300" />
        </div>
      </div>
    </>
  );
}
