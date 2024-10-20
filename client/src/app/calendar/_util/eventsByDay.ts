import { useMemo } from 'react';
import { CalendarProps, EventType } from '../_components/Calendar';
import { alphabetical } from '@/util/sort';
import { UseDatesArrayProps, useDatesArray } from './dateUtils';

export type EventsByDay = {
  date: number;
  count: number;
  noChanges: boolean;
  arrivals: EventType[];
  departures: EventType[];
  unchanged: EventType[];
};

export function useEventsByDay<CB extends (e: EventsByDay) => any>(
  props: Pick<CalendarProps, 'events'> & UseDatesArrayProps,
  processor: CB,
  withDefault?: boolean,
): ReturnType<CB>[] | null;
export function useEventsByDay<CB extends undefined>(
  props: Pick<CalendarProps, 'events'> & UseDatesArrayProps,
  processor?: CB,
  withDefault?: boolean,
): EventsByDay[] | null;
export function useEventsByDay<CB>(
  props: Pick<CalendarProps, 'events'> & UseDatesArrayProps,
  processor?: CB,
  withDefault?: boolean,
) {
  type T = CB extends (e: EventsByDay) => any ? ReturnType<CB> : never;

  const { events: events_in } = props;

  const dates = useDatesArray(props);

  const eventsByDay = useMemo<
    (T extends never ? EventsByDay : T)[] | null
  >(() => {
    if (!events_in)
      return withDefault
        ? dates.map((d) => {
            const ad = EBD_DEFAULT(d);
            if (typeof processor === 'function') return processor(ad);
            return ad;
          })
        : null;
    const events = events_in.sort(alphabetical((s) => s.title));
    return dates.map((d) => {
      let ad = {
        date: d,
        count: events.filter(
          (event) => event.dateStart <= d && event.dateEnd >= d,
        ).length,
        arrivals: events.filter((event) => event.dateStart === d),
        departures: events.filter((event) => event.dateEnd === d),
      } as EventsByDay;
      ad = {
        ...ad,
        unchanged: events.filter(
          (event) =>
            event.dateStart <= d &&
            event.dateEnd > d &&
            !ad.arrivals.find((it) => it.id === event.id) &&
            !ad.departures.find((it) => it.id === event.id),
        ),
        noChanges: !ad.arrivals.length && !ad.departures.length,
      };

      if (typeof processor === 'function') return processor(ad);
      return ad;
    });
  }, [dates, events_in, processor, withDefault]);

  return eventsByDay;
}

const EBD_DEFAULT: (d: number) => EventsByDay = (date) => ({
  date,
  count: 0,
  noChanges: false,
  arrivals: [],
  departures: [],
  unchanged: [],
});
