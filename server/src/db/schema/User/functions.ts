import {
  err,
  getTypedScopeFunctions,
  handle as h,
  scopeError,
} from '@/db/lib/utilities';

import type {
  MutationResolvers,
  QueryResolvers,
  UserResolvers,
} from '@/db/__types/graphql-types';
import type { ResolverContext } from '@/db/graph';
import { generateKey } from '@/util/generate';
import { DBUser } from './source';
import { passwordless } from '@/auth/passkeys';

const { scopeDiff, scoped } = getTypedScopeFunctions<ResolverContext>();

export const getUsers = h<QueryResolvers['users']>(
  scoped('ADMIN'),
  ({ sources }) => {
    return sources.user.getAll();
  }
);

export const getUser = h<QueryResolvers['user']>(
  ({ sources, args: { id } }) => {
    return sources.user.get(id);
  }
);

export const getUserFromEmail = h<QueryResolvers['userFromEmail']>(
  scoped('ADMIN'),
  async ({ sources, args: { email } }) => {
    const resp = await sources.user.findBy('email', email);
    if (!resp.length) return null;
    return resp[0];
  }
);

export const getUserFromAuth = h<QueryResolvers['userFromAuth']>(
  ({ sources, userId }) => {
    if (!userId) throw scopeError();

    return sources.user.get(userId);
  }
);

export const getUserSECURE = h<QueryResolvers['userSECURE']>(
  scoped('__SECURE'),
  async ({ sources, args: { id } }) => {
    const resp = await sources.user.get(id);
    if (!resp) return null;

    return {
      user: resp,
      secret: resp.secret,
    };
  }
);

export const userCreate = h<MutationResolvers['userCreate']>(
  async ({ sources, args: newUser, scope }) => {
    const nu = newUser as DBUser;

    const u = await sources.user.findBy('email', nu.email);
    if (u.length) throw err('USER_ALREADY_EXISTS');

    if (nu.scope?.length && !scopeDiff(scope, `ADMIN`)) throw scopeError();

    const secret = await generateKey();
    nu.secret = secret;

    return sources.user.create(nu);
  }
);

export const userUpdate = h<MutationResolvers['userUpdate']>(
  async ({ sources, args, scope, userId }) => {
    const updates = args as Partial<DBUser>;
    // extract user id and check scope
    const id = args.id;
    delete updates.id;
    if (!(userId === id || scopeDiff(scope, `ADMIN`))) throw scopeError();

    const u = await sources.user.get(id);
    if (!u) throw err('USER_NOT_FOUND');

    // user shouldn't be able to update their own scope without permissions
    if (updates.scope?.length && !scopeDiff(scope, `ADMIN`)) throw scopeError();

    return sources.user.update(id, updates);
  }
);

export const userDelete = h<MutationResolvers['userDelete']>(
  async ({ sources, args: { id }, scope, userId }) => {
    if (!(userId === id || scopeDiff(scope, `ADMIN`))) throw scopeError();

    return sources.user.delete(id);
  }
);

export const userResetSecret = h<MutationResolvers['userResetSecret']>(
  async ({ sources, args: { id }, scope, userId }) => {
    if (!(userId === id || scopeDiff(scope, `ADMIN`))) throw scopeError();

    const u = await sources.user.get(id);
    if (!u) throw err('USER_NOT_FOUND');

    return sources.user.update(id, {
      secret: await generateKey(),
    });
  }
);

export const getUserCredentials = h<UserResolvers['credentials']>(
  async ({ parent: { id }, scope, userId }) => {
    if (!scopeDiff(scope, 'ADMIN') && userId !== id) throw scopeError();

    return (await passwordless.listCredentials(id)).map((c) => ({
      ...c,
      id: c.descriptor.id,
      createdAt: c.createdAt?.toString(),
      lastUsedAt: c.lastUsedAt?.toString(),
    }));
  }
);
