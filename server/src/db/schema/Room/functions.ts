import type { RoomModule as M } from './__types/module-types';
import { ROOT_CABIN_ID, type DBRoom } from './source';

import {
  err,
  getTypedScopeFunctions,
  handle as h,
  loggedIn,
} from '@@/db/lib/utilities';
import { ResolverContext } from '@@/db/graph';
import { dateTS, queryStaysByDate, validateDates } from '../Stay/functions';

const { scoped, scopeDiff } = getTypedScopeFunctions<ResolverContext>();

export const getRooms = h<M.QueryResolvers['rooms']>(
  loggedIn(),
  async ({ sources }) => {
    return sources.room.getAll();
  }
);

export const getRoom = h<M.QueryResolvers['room']>(
  loggedIn(),
  async ({ sources, args: { id } }) => {
    return sources.room.get(id);
  }
);

export const getRoomsNoCabin = h<M.QueryResolvers['roomsNoCabin']>(
  loggedIn(),
  async ({ sources }) => {
    return sources.room.findBy('cabinId', ROOT_CABIN_ID);
  }
);

export const getRoomsFromCabin = h<M.QueryResolvers['roomsFromCabin']>(
  loggedIn(),
  async ({ sources, args: { cabinId } }) => {
    return sources.room.findBy('cabinId', cabinId);
  }
);

export const roomCreate = h<M.MutationResolvers['roomCreate']>(
  scoped('ADMIN', 'CALENDAR_ADMIN'),
  async ({ sources, args }) => {
    const nr = args as DBRoom;
    nr.availableBeds = 0;

    // check cabin exists
    const cabin = await sources.cabin.get(nr.cabinId);
    if (!cabin) throw err('CABIN_NOT_FOUND');

    return sources.room.create(nr);
  }
);

export const roomCreateMultiple = h<M.MutationResolvers['roomCreateMultiple']>(
  scoped('ADMIN', 'CALENDAR_ADMIN'),
  async ({ sources, args: { rooms } }) => {
    const items = rooms as DBRoom[];

    // check cabins exist
    const cabinIds = items.map((r) => r.cabinId);
    const cabins = await sources.cabin.getMultiple(cabinIds);
    if (cabins.filter((it) => !it?.id).length) throw err('CABIN_NOT_FOUND');

    return sources.room.createMultiple(items);
  }
);

export const roomUpdate = h<M.MutationResolvers['roomUpdate']>(
  scoped('ADMIN', 'CALENDAR_ADMIN'),
  async ({ sources, args: { id, ...updates } }) => {
    // make sure room exists
    const room = await sources.room.get(id);
    if (!room) throw err('ROOM_NOT_FOUND');

    // verify cabinId if provided
    if (updates.cabinId) {
      const cabin = await sources.cabin.get(updates.cabinId);
      if (!cabin) throw err('CABIN_NOT_FOUND');
    }

    return sources.room.update(id, updates);
  }
);

export const roomDelete = h<M.MutationResolvers['roomDelete']>(
  scoped('ADMIN', 'CALENDAR_ADMIN'),
  async ({ sources, args: { id } }) => {
    // make sure room exists
    const room = await sources.room.get(id);
    if (!room) throw err('ROOM_NOT_FOUND');

    return sources.room.delete(id);
  }
);

export const getRoomCabin = h<M.RoomResolvers['cabin']>(
  async ({ sources, parent }) => {
    const { cabinId } = parent as DBRoom;
    if (cabinId === ROOT_CABIN_ID) return null;
    return sources.cabin.get(cabinId);
  }
);

export const getRoomAvailableBeds = h<M.RoomResolvers['availableBeds']>(
  async ({ sources, parent, args: { start, end } }) => {
    const { id: roomId, noCount, beds } = parent as DBRoom;
    if (noCount) return null;

    // standarize dates
    start = dateTS(start);
    end = dateTS(end);
    const valid = validateDates(start, end);
    if (!valid) throw err('invalid dates');

    // get all reservations in this time frame
    const stays = await queryStaysByDate(sources, start, end);
    const reservations = stays
      .map((s) =>
        s.reservationIds
          .filter((r) => r.roomId === roomId)
          .map(() => ({
            start: s.dateStart,
            end: s.dateEnd,
          }))
      )
      .flat();

    // count number of occupants
    let maxOccupants = 0;
    do {
      if (reservations.length < 2) {
        maxOccupants = reservations.length;
        break;
      }

      // day-by-day
      for (let t = start; t < end; t += 3600 * 24) {
        // count the resrvations on this day (t)
        const count = reservations.filter((r) => {
          return r.start <= t && r.end > t;
        }).length;
        if (count > maxOccupants) maxOccupants = count;
      }
    } while (false);

    return beds - maxOccupants;
  }
);

export const isRoomType = h<M.RoomResolvers['__isTypeOf']>(({ parent }) => {
  return !('text' in parent);
});
