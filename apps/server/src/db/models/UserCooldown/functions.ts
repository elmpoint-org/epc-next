import { ResolverContext } from '##/db/graph.js';
import { DBType } from '##/db/lib/Model.js';
import {
  err,
  getTypedScopeFunctions,
  handle as h,
  scopeError,
} from '##/db/lib/utilities.js';

import { UserCooldownModule as M } from './__types/module-types';
import { DBUserCooldown } from './source';

const { scoped, scopeDiff } = getTypedScopeFunctions<ResolverContext>();

export const getUserCooldown = h<M.QueryResolvers['userCooldown']>(
  async ({ sources, args: { userId }, scope, userId: authUserId }) => {
    if (!scopeDiff(scope, 'ADMIN') && userId !== authUserId) throw scopeError();

    return (await sources.userCooldown.findBy('userId', userId))?.[0];
  }
);

export const userCooldownUpdate = h<M.MutationResolvers['userCooldownUpdate']>(
  scoped('ADMIN'),
  async ({ sources, args: { userId, updates } }) => {
    // create a new entry if it does not exist
    let cooldown = (await sources.userCooldown.findBy('userId', userId))?.[0];
    if (!cooldown) return sources.userCooldown.create({ userId, ...updates });

    // otherwise update existing
    return sources.userCooldown.update(cooldown.id, updates);
  }
);

export const userCooldownPurge = h<M.MutationResolvers['userCooldownPurge']>(
  scoped('ADMIN'),
  async ({ sources }) => {
    const all = await sources.userCooldown.getAll();
    await sources.userCooldown.deleteMultiple(all.map((it) => it.id));
    return all;
  }
);

export const getUserCooldownUser = h<M.UserCooldownResolvers['user']>(
  async ({ sources, parent }) => {
    const { userId } = parent as DBType<DBUserCooldown>;
    return sources.user.get(userId);
  }
);
