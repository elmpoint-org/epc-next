'use client';

import { useMemo } from 'react';

import { EventType } from '../_components/Calendar';
import {
  CABIN_COLORS,
  CabinColor,
  getCabinColor,
  getCabinColorObject,
} from './cabinColors';

export function useEventColorIds(events: EventType[]) {
  const ids = useMemo(() => {
    const out: Record<string, string | undefined> = {};

    for (const event of events) {
      if (event.reservations.length) {
        const r = event.reservations[0];
        if (r.room && 'id' in r.room) {
          let c = getCabinColor(r.room.id);
          if (c) {
            out[event.id] = r.room.id;
            continue;
          }
          c = getCabinColor(r.room.cabin?.id);
          if (c) {
            out[event.id] = r.room.cabin?.id;
            continue;
          }
        }
      }

      out[event.id] = undefined;
    }

    return out;
  }, [events]);
  return ids;
}

export function useEventColorId(event: EventType) {
  const ids = useEventColorIds([event]);
  return ids[event.id];
}

export function useEventColorObject(
  event: EventType,
  colorOverride?: CabinColor,
) {
  const parse = (s?: CabinColor) =>
    CABIN_COLORS[s ?? 'DEFAULT'] ?? CABIN_COLORS.DEFAULT;
  const colorId = useEventColorId(event);
  const css = colorOverride
    ? parse(colorOverride)
    : getCabinColorObject(colorId, true);

  return css;
}
