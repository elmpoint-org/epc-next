import { DBPartial, DBType, InitialType, QueryOp } from '##/db/lib/Model.js';
import type { StayModule as M } from './__types/module-types';

import {
  CtxExtended,
  err,
  getTypedScopeFunctions,
  handle as h,
  loggedIn,
  scopeError,
} from '##/db/lib/utilities.js';
import { ResolverFn } from '##/db/__types/graphql-types.js';
import { ResolverContext } from '##/db/graph.js';
import { CALENDAR_SEARCH_MAX_EVENT_LENGTH_DAYS } from '##/CONSTANTS.js';
import { DBStay, ScalarRoom } from './source';

import { randomUUID as uuid } from 'node:crypto';
import dayjs from 'dayjs';
import dayjsUTC from 'dayjs/plugin/utc';
dayjs.extend(dayjsUTC);

const { scoped, scopeDiff } = getTypedScopeFunctions<ResolverContext>();

const DAYS_AFTER_SEC = CALENDAR_SEARCH_MAX_EVENT_LENGTH_DAYS * 3600 * 24;

export const getStays = h<M.QueryResolvers['stays']>(
  loggedIn(),
  async ({ sources, args: { start, end, deep } }) => {
    // validate
    start = dateTS(start);
    end = dateTS(end);
    const valid = validateDates(start, end);
    if (!valid) throw err('INVALID_DATES');

    const stays = await queryStaysByDate(
      sources,
      start,
      end,
      deep ?? undefined
    );

    return stays;
  }
);

export const getStay = h<M.QueryResolvers['stay']>(
  loggedIn(),
  async ({ sources, args: { id } }) => {
    return sources.stay.get(id);
  }
);

export const getStaysInRoom = h<M.QueryResolvers['staysInRoom']>(
  loggedIn(),
  async ({ sources, args: { roomId, start, end } }) => {
    // validate
    start = dateTS(start);
    end = dateTS(end);
    const valid = validateDates(start, end);
    if (!valid) throw err('INVALID_DATES');

    const stays = await queryStaysByDate(sources, start, end);
    return stays.filter((s) =>
      s.reservationIds.some((r) => r.roomId === roomId)
    );
  }
);

export const getStayMostRecentTimestamp = h<
  M.QueryResolvers['stayMostRecentTimestamp']
>(async ({ sources, args: { after } }) => {
  const REQ_LIMIT = 25;

  // get {number} of items updated after the specified time
  const found = await sources.stay.query(
    'tupdated',
    QueryOp.GT,
    after,
    REQ_LIMIT
  );

  // if none, assume provided TS is current
  if (!found.length) return after;

  // otherwise find most recent timestamp
  const recent = found.sort((a, b) => b.tupdated - a.tupdated)[0].tupdated;

  return recent;
});

export const stayCreate = h<M.MutationResolvers['stayCreate']>(
  loggedIn(),
  async ({ sources, args: fields }) => {
    // standardize dates
    fields.dateStart = dateTS(fields.dateStart);
    fields.dateEnd = dateTS(fields.dateEnd);
    const valid = validateDates(fields.dateStart, fields.dateEnd);
    if (!valid) throw err('INVALID_DATES');

    const res = fields.reservations;
    const stay: InitialType<DBStay> = {
      ...fields,
      reservationIds: res.map((r) => {
        if (r.roomId && r.customText) throw err('INVALID_RESERVATION');
        const res: ScalarRoom = { name: r.name };
        if (r.roomId) res.roomId = r.roomId;
        if (r.customText) res.customText = r.customText;
        return res;
      }),
    };

    return sources.stay.create(stay);
  }
);

export const stayUpdate = h<M.MutationResolvers['stayUpdate']>(
  trustedUserCheck(),
  async ({ sources, args: { id, ...updates } }) => {
    // make sure stay exists
    const stay = await sources.stay.get(id);
    if (!stay) throw err('STAY_NOT_FOUND');

    // validate dates
    if (typeof updates.dateStart === 'number')
      updates.dateStart = dateTS(updates.dateStart);
    if (typeof updates.dateEnd === 'number')
      updates.dateEnd = dateTS(updates.dateEnd);
    const valid = validateDates(
      updates.dateStart ?? stay.dateStart,
      updates.dateEnd ?? stay.dateEnd
    );
    if (!valid) throw err('INVALID_DATES');

    // update
    const res = updates.reservations;
    const newstay: DBPartial<DBType<DBStay>> = {
      ...updates,
      reservationIds: res?.map((r) => {
        if (r.roomId && r.customText) throw err('INVALID_RESERVATION');

        const res: ScalarRoom = { name: r.name };
        if (r.roomId) res.roomId = r.roomId;
        if (r.customText) res.customText = r.customText;
        return res;
      }),
    };

    return sources.stay.update(id, newstay);
  }
);

export const stayDelete = h<M.MutationResolvers['stayDelete']>(
  trustedUserCheck(),
  async ({ sources, args: { id } }) => {
    return sources.stay.delete(id);
  }
);

export const staySplit = h<M.MutationResolvers['staySplit']>(
  trustedUserCheck(),
  async ({ sources, args: { id, date } }) => {
    const stayToSplit = await sources.stay.get(id);
    if (!stayToSplit) throw err('STAY_NOT_FOUND');

    // validate date
    if (typeof date === 'number') date = dateTS(date);
    const valid = validateDates(stayToSplit.dateStart, date);
    if (!valid) throw err('INVALID_DATE');

    // create new stay
    const newStay: DBStay = {
      ...stayToSplit,
      dateStart: date,
      id: uuid(),
    };

    // run updates
    const outs = await Promise.all([
      sources.stay.update(id, { dateEnd: date }),
      sources.stay.create(newStay),
    ]);

    return outs[1];
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

export const isCustomRoomType = h<M.CustomRoomResolvers['__isTypeOf']>(
  ({ parent }) => {
    return 'text' in parent;
  }
);

// -----------------------------

export async function queryStaysByDate(
  sources: ResolverContext['sources'],
  start: number,
  end: number,
  deepSearch?: boolean
) {
  // query for all stays that end during or after the specified range (within reason)
  const all_stays = await sources.stay.query(
    'dateEnd',
    !deepSearch ? QueryOp.BETWEEN : QueryOp.GTE,
    start,
    !deepSearch ? end + DAYS_AFTER_SEC : undefined
  );
  // remove future events out of range
  const stays = all_stays.filter((s) => s.dateStart <= end);

  return stays;
}

/** this function reads a unix timestamp as its current date **according to GMT**, and returns a new timestamp at midnight for that day. */
export function dateTS(ts: number) {
  return dayjs.unix(ts).utc().startOf('date').unix();
}

/** validate dates.
 * @returns true if valid.
 */
export function validateDates(start: number, end: number) {
  start = dateTS(start);
  end = dateTS(end);
  const d1 = 3600 * 24;
  const days = (end - start) / d1;
  if (days < 0) return false;
  return true;
}

/** get dayjs object for a TS datestamp. */
export function dateTSObject(ts: number) {
  return dayjs.unix(ts).utc();
}

function trustedUserCheck() {
  return async ({
    sources,
    scope,
    userId,
    args: { id },
  }: CtxExtended<
    ResolverFn<unknown, unknown, ResolverContext, { id: string }>
  >): Promise<undefined> => {
    // get objects
    const stay = await sources.stay.get(id);
    if (!stay) throw err('STAY_NOT_FOUND');
    const author = await sources.user.get(stay.authorId);

    // check scope...

    // admin check
    if (scopeDiff(scope, 'ADMIN', 'CALENDAR_ADMIN')) return;

    // author check
    if (userId === stay.authorId) return;

    // trusted user check
    const isTrustedUser = userId && author?.trustedUserIds?.includes(userId);
    if (isTrustedUser) return;

    // user is not allowed...
    throw scopeError();
  };
}
