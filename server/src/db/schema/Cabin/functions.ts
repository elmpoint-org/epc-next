import type { CabinModule as M } from './__types/module-types';
import type { DBCabin } from './source';

import {
  err,
  getTypedScopeFunctions,
  handle as h,
  loggedIn,
} from '@@/db/lib/utilities';
import { ResolverContext } from '@@/db/graph';

const { scoped, scopeDiff } = getTypedScopeFunctions<ResolverContext>();

export const getCabins = h<M.QueryResolvers['cabins']>(
  loggedIn(),
  async ({ sources }) => {
    return sources.cabin.getAll();
  }
);

export const getCabin = h<M.QueryResolvers['cabin']>(
  loggedIn(),
  async ({ sources, args: { id } }) => {
    return sources.cabin.get(id);
  }
);

export const cabinCreate = h<M.MutationResolvers['cabinCreate']>(
  scoped('ADMIN', 'CALENDAR_ADMIN'),
  async ({ sources, args }) => {
    const cabin = args as DBCabin;

    return sources.cabin.create(cabin);
  }
);

export const cabinCreateMultiple = h<
  M.MutationResolvers['cabinCreateMultiple']
>(
  scoped('ADMIN', 'CALENDAR_ADMIN'), //
  async ({ sources, args: { cabins } }) => {
    const items = cabins as DBCabin[];

    return sources.cabin.createMultiple(items);
  }
);

export const cabinUpdate = h<M.MutationResolvers['cabinUpdate']>(
  scoped('ADMIN', 'CALENDAR_ADMIN'),
  async ({ sources, args: { id, ...updates } }) => {
    // make sure cabin exists
    const cabin = sources.cabin.get(id);
    if (!cabin) throw err('CABIN_NOT_FOUND');

    return sources.cabin.update(id, updates);
  }
);

export const cabinDelete = h<M.MutationResolvers['cabinDelete']>(
  scoped('ADMIN', 'CALENDAR_ADMIN'),
  async ({ sources, args: { id } }) => {
    // make sure cabin exists
    const cabin = sources.cabin.get(id);
    if (!cabin) throw err('CABIN_NOT_FOUND');

    return sources.cabin.delete(id);
  }
);

export const getCabinRooms = h<M.CabinResolvers['rooms']>(
  async ({ sources, parent }) => {
    const { id } = parent as DBCabin;
    return sources.room.findBy('cabinId', id);
  }
);