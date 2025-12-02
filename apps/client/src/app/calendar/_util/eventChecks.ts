import { useCallback } from 'react';
import { EVENTS_QUERY, EventType } from '../_components/Calendar';
import { Cabin, GuestEntry, Room, useFormCtx } from '../new/state/formCtx';
import { useLocalOccupants } from './localOccupants';
import { graphAuth } from '@/query/graphql';
import { StayObject } from '../new/_components/FormActions';
import { D1, dateDiff } from '@epc/date-ts';
import { useGetRooms } from '../new/state/getRoomData';

export namespace EventIssue {
  export interface Defs {
    /** room is full or overfull */
    ROOM_CONFLICT: {
      room: Room;
      reservations: GuestEntry[];
      events: EventType[];
    };

    /** room will be shared with someone else */
    ROOM_SHARING: {
      room: Room;
      reservations: GuestEntry[];
      events: EventType[];
    };

    /** event date range is worryingly long */
    LONG_DATE_RANGE: {
      dateStart: number;
      dateEnd: number;
      diff: number;
    };

    /** for cabins where coordinator approval is always needed */
    MANAGED_CABIN: {
      cabin: Cabin;
      reservations: GuestEntry[];
    };

    /** when cabin usage is high, recommend checking with coordinator */
    HIGH_CAPACITY: {
      cabin: Cabin;
      reservations: GuestEntry[];
    };

    /** when a row is not fully populated */
    UNFINISHED_RES: {
      reservation: GuestEntry;
    };
  }

  export type Kind = keyof EventIssue.Defs;
  export type Map = {
    [K in keyof EventIssue.Defs]: { kind: K } & EventIssue.Defs[K];
  };
  export type Generic = EventIssue.Map[keyof EventIssue.Map];
}

/** how long is a suspiciously long stay */
const LONG_STAY_LENGTH_DAYS = 90;
/** cabins where a reservation should always prompt a coordinator check */
const MANAGED_CABINS = [
  'bf802b84-2813-4438-b2da-f997c138a14a', // house
];
/** what ratio of beds in a cabin should be full to warrant a busy cabin warning */
const BUSY_CABIN_BED_RATIO = 0.6;

export function useEventChecks() {
  const { guests, updateId } = useFormCtx();
  const { rooms: allRooms } = useGetRooms(updateId ?? undefined);

  const localOccupants = useLocalOccupants();

  const runEventChecks = useCallback(
    async (stay: StayObject) => {
      const issues: EventIssue.Generic[] = [];
      const { findOrCreateIssue } = issueRefGetter(issues);

      // get all events
      const { data, errors } = await graphAuth(EVENTS_QUERY, {
        start: stay.dateStart + D1,
        end: stay.dateEnd,
      });
      if (errors || !data?.stays) return null;
      const allStays = data.stays;

      const conflictMap = new Map<string, EventType[]>();
      function findConflicts(roomId: string) {
        if (typeof conflictMap.get(roomId) !== 'undefined')
          return conflictMap.get(roomId)!;

        const evts = allStays.filter((event) => {
          if (event.id === updateId) return false;
          for (const r of event.reservations) {
            if (r.room?.__typename !== 'Room' || r.room.id !== roomId) continue;
            return true;
          }
          return false;
        });
        conflictMap.set(roomId, evts);
        return evts;
      }

      // dates check
      const stayLen = dateDiff(stay.dateEnd, stay.dateStart);
      if (stayLen > LONG_STAY_LENGTH_DAYS)
        issues.push({
          kind: 'LONG_DATE_RANGE',
          diff: stayLen,
          dateStart: stay.dateStart,
          dateEnd: stay.dateEnd,
        });

      // run through reservations
      for (const res of guests) {
        const { room, cabin } = res.room;

        console.log(res);

        // ROOM_CONFLICT & ROOM_SHARING
        if (room !== null && !room.noCount) {
          if (room.availableBeds === null)
            room.availableBeds =
              allRooms.find((it) => it.id === room.id)?.availableBeds ??
              room.beds;

          const available =
            room.availableBeds - (localOccupants.get(room.id) ?? 0);

          if (available < 0) {
            // room is overfull
            const issue = findOrCreateIssue(
              'ROOM_CONFLICT',
              (it) => it.room.id === room.id,
              { room, reservations: [], events: findConflicts(room.id) },
            );
            issue.reservations.push(res);
          } else if (room.availableBeds < room.beds) {
            // room is shared
            const issue = findOrCreateIssue(
              'ROOM_SHARING',
              (it) => it.room.id === room.id,
              { room, reservations: [], events: findConflicts(room.id) },
            );
            issue.reservations.push(res);
          }
        }

        // TODO: HIGH_CAPACITY
        // use the BUSY_CABIN_BED_RATIO. calculate cabin utilization on server?

        // MANAGED_CABIN
        if (cabin && MANAGED_CABINS.includes(cabin.id)) {
          const issue = findOrCreateIssue(
            'MANAGED_CABIN',
            (it) => it.cabin.id === cabin.id,
            { cabin, reservations: [] },
          );
          issue.reservations.push(res);
        }

        // UNFINISHED_RES
        if (room === null) {
          issues.push({
            kind: 'UNFINISHED_RES',
            reservation: res,
          });
        }
      }

      return issues;
    },
    [allRooms, guests, localOccupants, updateId],
  );

  return runEventChecks;
}

export function issueRefGetter(issues: EventIssue.Generic[]) {
  function getIssue<Kind extends EventIssue.Kind>(
    kind: Kind,
    additionalReq: (item: EventIssue.Map[Kind]) => boolean = () => true,
  ) {
    return issues.find(
      (issue): issue is EventIssue.Map[Kind] =>
        issue.kind === kind && additionalReq(issue as EventIssue.Map[Kind]),
    );
  }

  function findOrCreateIssue<Kind extends EventIssue.Kind>(
    kind: Kind,
    additionalReq: Parameters<typeof getIssue<Kind>>[1],
    init: Omit<EventIssue.Map[Kind], 'kind'>,
  ) {
    const issue = getIssue(kind, additionalReq);
    if (issue) return issue;

    const i = issues.push({ kind, ...init } as any as EventIssue.Generic) - 1;
    return issues[i] as EventIssue.Map[Kind];
  }

  return { getIssue, findOrCreateIssue };
}
