import type { RoomModule as M } from './__types/module-types';
import type { DBRoom } from './source';

import {
  err,
  getTypedScopeFunctions,
  handle as h,
  loggedIn,
} from '@@/db/lib/utilities';
import { ResolverContext } from '@@/db/graph';

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
    const cabin = sources.cabin.get(nr.cabinId);
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
    const room = sources.room.get(id);
    if (!room) throw err('ROOM_NOT_FOUND');

    // verify cabinId if provided
    if (updates.cabinId) {
      const cabin = sources.cabin.get(updates.cabinId);
      if (!cabin) throw err('CABIN_NOT_FOUND');
    }

    return sources.room.update(id, updates);
  }
);

export const roomDelete = h<M.MutationResolvers['roomDelete']>(
  scoped('ADMIN', 'CALENDAR_ADMIN'),
  async ({ sources, args: { id } }) => {
    // make sure room exists
    const room = sources.room.get(id);
    if (!room) throw err('ROOM_NOT_FOUND');

    return sources.room.delete(id);
  }
);

export const getRoomCabin = h<M.RoomResolvers['cabin']>(
  async ({ sources, parent }) => {
    const { cabinId } = parent as DBRoom;
    return sources.cabin.get(cabinId);
  }
);

export const getRoomAvailableBeds = h<M.RoomResolvers['availableBeds']>(
  async ({ sources }) => {
    // TODO calculate based on reservations
    return null;
  }
);
