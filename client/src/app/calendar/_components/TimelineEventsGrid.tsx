import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import { D1 } from '../_util/dateUtils';
import { CalendarProps } from './Calendar';
import { gridCols } from '../_util/grid';

import TimelineEvent, { EventPlaceholder } from './TimelineEvent';

export default function TimelineEventsGrid({
  roomId,
  cabinId,
  noRoom,
  onOpen,
  ...props
}: {
  roomId?: string;
  cabinId?: string;
  noRoom?: boolean;
  onOpen?: () => void;
} & CalendarProps) {
  const {
    events: events_in,
    days,
    dates,
    roomCollapse: {
      full: [fullCollapse],
    },
  } = props;

  const events = useMemo(() => {
    // filter for norooms if requested
    if (noRoom)
      return events_in?.filter(
        (evt) =>
          !evt.reservations.filter((r) => r.room && 'id' in r.room).length,
      );

    // filter for cabin overview
    if (cabinId)
      return events_in?.filter((evt) =>
        evt.reservations.some(
          (r) => r.room && 'id' in r.room && r.room.cabin?.id === cabinId,
        ),
      );

    // filter for single room
    if (!roomId?.length) return events_in;
    return events_in?.filter((evt) =>
      evt.reservations.some(
        (r) => r.room && 'id' in r.room && r.room.id === roomId,
      ),
    );
  }, [cabinId, events_in, noRoom, roomId]);

  // COLLAPSED PLACEHOLDERS
  const cabinPlaceholders = useMemo(() => {
    let placeholders: EventPlaceholder[] = [];
    if (!events?.length) return placeholders;

    // check every day
    for (let t = dates.start - D1; t <= dates.end; t += D1) {
      // find events today
      const matches = events.filter((r) => r.dateStart <= t && r.dateEnd > t);

      // simple cases (extend existing entry if possible)
      const last = placeholders.at(-1);
      if (matches.length === 0) {
        continue;
      } else if (matches.length === 1) {
        if (last && last.eventId === matches[0].id) {
          last.end = t + D1;
          continue;
        }
      } else {
        if (last && last?.combined && last.end === t) {
          last.end = t + D1;
          if (last.combined < matches.length) last.combined = matches.length;
          continue;
        }
      }

      // OTHERWISE, make new entry
      placeholders.push({
        eventId: matches.length === 1 ? matches[0].id : undefined,
        combined: matches.length > 1 ? matches.length : 0,
        start:
          !placeholders.length && t === dates.start && matches[0]?.dateStart < t
            ? t - D1
            : t,
        end:
          t === dates.end && matches[0]?.dateEnd > t + D1 ? t + 2 * D1 : t + D1,
      });
    }

    return placeholders;
  }, [dates, events]);

  const gridTemplateColumns = gridCols(days);

  return (
    <>
      <div
        className="grid flex-1 grid-flow-row-dense auto-rows-fr gap-2"
        style={{ gridTemplateColumns }}
      >
        {!cabinId || !fullCollapse
          ? events?.map((event) => (
              // regular events
              <TimelineEvent
                key={event.id}
                event={event}
                highlightRoom={roomId}
                {...props}
              />
            ))
          : cabinPlaceholders.map((p, i) => (
              // collapsed events
              <TimelineEvent
                key={i}
                placeholder={p}
                onOpen={onOpen}
                theme={p.combined ? 'NATIVE' : undefined}
                event={
                  (p.eventId?.length &&
                    events?.find((it) => it.id === p.eventId)) || {
                    id: uuid(),
                    dateStart: 0,
                    dateEnd: 0,
                    reservations: [],
                    author: null,
                    description: '',
                    title: '',
                  }
                }
                {...props}
              />
            ))}
      </div>
    </>
  );
}
