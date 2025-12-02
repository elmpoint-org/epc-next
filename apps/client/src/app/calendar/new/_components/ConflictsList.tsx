import { Children } from '@/util/propTypes';
import { EventIssue } from '../../_util/eventChecks';
import { ComponentPropsWithoutRef, ReactNode, useMemo } from 'react';
import { clmx } from '@/util/classConcat';
import { D1, dateDiff, dateFormat } from '@epc/date-ts';
import { useBannerPosition } from '../../_util/useBannerPosition';
import { EventType } from '../../_components/Calendar';
import { StayObject } from './FormActions';

export default function ConflictsList({ issues }: { issues: EventIssue.Generic[] }) {
  return (
    <ol className="flex flex-col">
      {issues.map((issue, i) => (
        <li key={i} className="group">
          {/* long reservation  */}
          {issue.kind === 'LONG_DATE_RANGE' && (
            <IssueFrame i={i} title={<>Long reservation</>}>
              <p>
                This reservation is <b>{issue.diff}</b> days long (
                {dateFormat(issue.dateStart, 'MMM. D, YYYY')} to{' '}
                {dateFormat(issue.dateEnd, 'MMM. D, YYYY')}). Double check that
                your dates are entered correctly.
              </p>
            </IssueFrame>
          )}

          {/* room conflict */}
          {issue.kind === 'ROOM_CONFLICT' && (
            <IssueFrame
              i={i}
              title={<span>Overbooked room</span>}
              secondary={
                <>
                  {issue.room.name}
                  {issue.room.cabin ? (
                    <span> ({issue.room.cabin.name})</span>
                  ) : null}
                </>
              }
            >
              <p>
                This room may be overbooked. It only has{' '}
                <b>
                  {issue.room.beds} bed{issue.room.beds !== 1 && 's'}
                </b>
                . See conflicting reservations below (hover for full title):
              </p>
              <div className="my-2">
                {dateDiff(issue.stay.dateEnd, issue.stay.dateStart) < 30 ? (
                  <ConflictsView issue={issue} />
                ) : (
                  <ConflictError />
                )}
              </div>
            </IssueFrame>
          )}

          {/* room sharing */}
          {issue.kind === 'ROOM_SHARING' && (
            <IssueFrame
              i={i}
              title={<span>Shared room</span>}
              secondary={
                <>
                  {issue.room.name}
                  {issue.room.cabin ? (
                    <span> ({issue.room.cabin.name})</span>
                  ) : null}
                </>
              }
            >
              <p>
                You’ll be sharing this room with others for at least one night.
                See matching reservations below (hover for full title):
              </p>
              <div className="my-2">
                {dateDiff(issue.stay.dateEnd, issue.stay.dateStart) < 30 ? (
                  <ConflictsView issue={issue} />
                ) : (
                  <ConflictError />
                )}
              </div>
            </IssueFrame>
          )}

          {/* managed cabin */}
          {issue.kind === 'MANAGED_CABIN' && (
            <IssueFrame
              i={i}
              title={<>Cabin Coordinator contact required</>}
              secondary={<>{issue.cabin.name}</>}
            >
              <div className="flex flex-col gap-2">
                <p>
                  You have placed{' '}
                  <b>
                    {issue.reservations.length} reservation
                    {issue.reservations.length !== 1 && 's'}
                  </b>{' '}
                  in <b>{issue.cabin.name}</b>.
                </p>
                <p>
                  {issue.cabin.name} bookings are overseen by the cabin
                  coordinator, TODO_COORD_NAME.{' '}
                  <b>Contact them directly to confirm availability.</b>
                </p>

                <p className="">
                  <span>Need to check: </span>
                  {issue.reservations.map((r, i) => (
                    <em key={i} className="">
                      {!!i && ', '}
                      {r.name} ({r.room.room?.name})
                    </em>
                  ))}
                </p>
              </div>
            </IssueFrame>
          )}

          {issue.kind === 'UNFINISHED_RES' && (
            <IssueFrame i={i} title={<>Unfinished rows</>}>
              You have <b>{issue.reservations.length}</b> incomplete room
              reservations, which will be deleted. Finish selecting a room (or
              choose the <em>CUSTOM</em> option from the dropdown) to save them.
            </IssueFrame>
          )}

          <IssueFrame
            i={i}
            className="hidden first:flex"
            title={<>{issue.kind.toLowerCase().replace(/_/g, ' ')}</>}
          >
            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-xs italic">no additional information</span>
            </div>
          </IssueFrame>
        </li>
      ))}
    </ol>
  );
}

function IssueFrame({
  i,
  title,
  secondary,
  className,
  classNames,
  children,
}: {
  i: number;
  title: ReactNode;
  secondary?: ReactNode;
  className?: string;
  classNames?: { secondary?: string };
} & Children) {
  return (
    <div className={clmx('flex flex-row gap-3 border-t py-4', className)}>
      <div className="hidden text-sm font-bold text-slate-400/80 sm:block">
        {i + 1}.
      </div>
      <div className="flex flex-1 flex-col gap-2 text-sm">
        {/* title block */}
        <div
          className="group/n flex flex-row items-center gap-1 border-b pb-3 text-xs sm:border-b-0 sm:pb-0 sm:text-sm"
          data-h={!secondary || null}
        >
          {/* title */}
          <div className="font-bold uppercase">{title}</div>

          <span className="text-slate-400 group-data-[h]/n:invisible">
            &ndash;
          </span>
          <div
            className={clmx(
              '-my-0.5 rounded-md bg-slate-200 px-1.5 py-0.5 group-data-[h]/n:invisible',
              classNames?.secondary,
            )}
          >
            {secondary ?? <>&nbsp;</>}
          </div>
        </div>
        {/* body */}
        <div className="t">{children}</div>
      </div>
    </div>
  );
}

function ConflictsView({
  issue,
}: {
  issue: EventIssue.Map['ROOM_CONFLICT' | 'ROOM_SHARING'];
}) {
  const { events, reservations, room, stay } = issue;
  const days = useMemo(
    () => dateDiff(stay.dateEnd, stay.dateStart) + 1,
    [stay.dateEnd, stay.dateStart],
  );

  return (
    <div className="relative pt-4">
      <div
        className="absolute inset-0 -z-10 grid grid-flow-row gap-1"
        style={{
          gridTemplateColumns: `repeat(${days * 2}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: days }).map((_, i) => (
          <div
            key={i}
            className="col-span-2 flex flex-col border-r last:border-0"
          >
            <div className="-ml-px overflow-hidden text-center text-[10px]">
              {dateFormat(stay.dateStart + i * D1, 'M/D')}
            </div>
          </div>
        ))}
      </div>

      <div
        className="grid grid-flow-row gap-1 pt-6"
        style={{
          gridTemplateColumns: `repeat(${days * 2}, minmax(0, 1fr))`,
        }}
      >
        {reservations.map((res, j) => (
          <ConflictItem
            key={j}
            issue={issue}
            event={stay}
            className="cursor-default border border-dashed border-dgreen bg-emerald-600/50 text-emerald-950 backdrop-blur-sm"
            title={stay.title}
          >
            {res.name}
          </ConflictItem>
        ))}
        {events.map((event, j) =>
          event.reservations.map(
            (r, k) =>
              r.room?.__typename === 'Room' &&
              r.room.id === room.id && (
                <ConflictItem
                  key={'' + j + k}
                  issue={issue}
                  event={event}
                  title={event.title}
                  className="cursor-default"
                >
                  {r.name}
                </ConflictItem>
              ),
          ),
        )}
      </div>
    </div>
  );
}

function ConflictItem({
  issue,
  event,
  className,
  children,
  ...props
}: {
  issue: EventIssue.Map['ROOM_CONFLICT' | 'ROOM_SHARING'];
  event: EventType | StayObject;
} & ComponentPropsWithoutRef<'div'>) {
  const { arrows, loc } = useBannerPosition(
    {
      dates: { start: issue.stay.dateStart, end: issue.stay.dateEnd },
      days: dateDiff(issue.stay.dateEnd, issue.stay.dateStart),
    },
    event,
  );

  return (
    <div
      {...props}
      className={clmx('flex truncate rounded-md bg-slate-300 px-1', className)}
      style={{
        gridColumn: `${loc.start} / ${loc.end}`,
      }}
    >
      {arrows.left && <>&lt;</>}
      <div className="flex-1 truncate text-center">{children}</div>
      {arrows.right && <>&gt;</>}
    </div>
  );
}

function ConflictError() {
  return (
    <div className="flex flex-col items-center justify-center py-1 text-center text-xs italic text-red-900">
      Reservation is too long to show conflicts view.
    </div>
  );
}
