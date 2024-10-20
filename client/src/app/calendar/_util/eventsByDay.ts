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

export function useEventsByDay(
  props: Pick<CalendarProps, 'events'> & UseDatesArrayProps,
) {
  const { events: events_in } = props;

  const dates = useDatesArray(props);

  const eventsByDay = useMemo<EventsByDay[] | null>(() => {
    if (!events_in) return dates.map(EBD_DEFAULT);
    const events = events_in.sort(alphabetical((s) => s.title));
    return dates.map((d) => {
      const ad = {
        date: d,
        count: events.filter(
          (event) => event.dateStart <= d && event.dateEnd >= d,
        ).length,
        arrivals: events.filter((event) => event.dateStart === d),
        departures: events.filter((event) => event.dateEnd === d),
      };
      return {
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
    });
  }, [dates, events_in]);

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
