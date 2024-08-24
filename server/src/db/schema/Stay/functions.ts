import { DBPartial, DBType, InitialType, QueryOp } from '@@/db/lib/Model';
import type { StayModule as M } from './__types/module-types';

import {
  err,
  getTypedScopeFunctions,
  handle as h,
  loggedIn,
} from '@@/db/lib/utilities';
import { ResolverContext } from '@@/db/graph';
import { CALENDAR_SEARCH_MAX_EVENT_LENGTH_DAYS } from '@@/CONSTANTS';
import { DBStay } from './source';

const { scoped, scopeDiff } = getTypedScopeFunctions<ResolverContext>();

const DAYS_AFTER_SEC = CALENDAR_SEARCH_MAX_EVENT_LENGTH_DAYS * 3600 * 24;

export const getStays = h<M.QueryResolvers['stays']>(
  loggedIn(),
  async ({ sources, args: { start, end, deep } }) => {
    // query for all stays that end during or after the specified range (within reason)
    const all_stays = await sources.stay.query(
      'dateEnd',
      !deep ? QueryOp.BETWEEN : QueryOp.GTE,
      start,
      !deep ? DAYS_AFTER_SEC : undefined
    );
    // remove future events out of range
    const stays = all_stays.filter((s) => s.dateStart <= end);

    return stays;
  }
);

export const getStay = h<M.QueryResolvers['stay']>(
  loggedIn(),
  async ({ sources, args: { id } }) => {
    return sources.stay.get(id);
  }
);

export const stayCreate = h<M.MutationResolvers['stayCreate']>(
  loggedIn(),
  async ({ sources, args: fields }) => {
    const res = fields.reservations;
    const stay: InitialType<DBStay> = {
      ...fields,
      reservationIds: res.map((r) => {
        if (r.roomId && r.customText) throw err('INVALID_RESERVATION');

        return {
          ...r,
          roomId: r.roomId ?? undefined,
          customText: r.customText ?? undefined,
        };
      }),
    };

    return sources.stay.create(stay);
  }
);

export const stayUpdate = h<M.MutationResolvers['stayUpdate']>(
  loggedIn(),
  async ({ sources, args: { id, ...updates } }) => {
    const res = updates.reservations;
    const stay: DBPartial<DBType<DBStay>> = {
      ...updates,
      reservationIds: res?.map((r) => {
        if (r.roomId && r.customText) throw err('INVALID_RESERVATION');

        return {
          ...r,
          roomId: r.roomId ?? undefined,
          customText: r.customText ?? undefined,
        };
      }),
    };

    return sources.stay.update(id, stay);
  }
);

export const stayDelete = h<M.MutationResolvers['stayDelete']>(
  loggedIn(),
  async ({ sources, args: { id } }) => {
    return sources.stay.delete(id);
  }
);

export const getStayAuthor = h<M.StayResolvers['author']>(
  async ({ sources, parent }) => {
    const { authorId } = parent as DBStay;
    return sources.user.get(authorId);
  }
);

export const getStayReservations = h<M.StayResolvers['reservations']>(
  loggedIn(),
  async ({ sources, parent }) => {
    const { reservationIds: rooms } = parent as DBStay;
    return Promise.all(
      rooms.map(async (room) => ({
        name: room.name,
        room: room.customText?.length
          ? { text: room.customText } // custom room
          : await sources.room.get(room.roomId ?? ''), // registered room
      }))
    );
  }
);
