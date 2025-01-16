import {
  err,
  getTypedScopeFunctions,
  handle as h,
  loggedIn,
  scopeError,
} from '@@/db/lib/utilities';

import type {
  MutationResolvers,
  QueryResolvers,
  UserResolvers,
} from '@@/db/__types/graphql-types';
import type { ResolverContext } from '@@/db/graph';
import { generateKey } from '@@/util/generate';
import { DBUser } from './source';
import { passwordless, passwordlessDeleteCredential } from '@@/auth/passkeys';
import {
  Credential,
  RegisterOptions,
} from '@passwordlessdev/passwordless-nodejs';
import { AxiosError } from 'axios';
import { prepEmail } from '@@/util/textTransform';
import { createHash } from 'node:crypto';

const { scopeDiff, scoped } = getTypedScopeFunctions<ResolverContext>();

export const getUsers = h<QueryResolvers['users']>(
  loggedIn(),
  ({ sources }) => {
    return sources.user.getAll();
  }
);

export const getUser = h<QueryResolvers['user']>(
  loggedIn(),
  ({ sources, args: { id } }) => {
    return sources.user.get(id);
  }
);

export const getUserFromEmail = h<QueryResolvers['userFromEmail']>(
  loggedIn(),
  async ({ sources, args: { email } }) => {
    const resp = await sources.user.findBy('email', prepEmail(email));
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
  scoped('ADMIN'),
  async ({ sources, args: newUser, scope }) => {
    const nu = newUser as DBUser;
    nu.email = prepEmail(nu.email);

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

    if (args.email?.length) {
      args.email = prepEmail(args.email);
      if (args.email !== u.email) {
        const ue = await sources.user.findBy('email', args.email);
        if (ue.length) throw err('EMAIL_ALREADY_TAKEN');
      }
    }

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

export const userCreateCredential = h<
  MutationResolvers['userCreateCredential']
>(async ({ sources, userId }) => {
  if (!userId) throw scopeError();

  const user = await sources.user.get(userId);

  const opts = new RegisterOptions();
  opts.userId = user.id;
  opts.username = user.email;
  const { token } = await passwordless.createRegisterToken(opts).catch((e) => {
    throw err('SERVER_ERROR', undefined, e);
  });

  return token;
});

export const userDeleteCredential = h<
  MutationResolvers['userDeleteCredential']
>(async ({ args: { id }, userId }) => {
  if (!userId) throw scopeError();

  // list user credentials
  const cs = await passwordless.listCredentials(userId).catch(() => {});
  if (!cs?.length) throw err('NO_CREDENTIALS_FOUND');

  // attempt to find the requested credential
  const c = cs.find((it) => it.descriptor.id === id);
  if (!c) throw err('CREDENTIAL_NOT_FOUND');

  // attempt deletion
  await passwordlessDeleteCredential(id).catch((err) => {
    throw err(
      'FAILED_TO_DELETE',
      undefined,
      err instanceof AxiosError ? err.response?.data : err
    );
  });

  // return deleted credential
  return parseCredential(c);
});

export const getUserCredentials = h<UserResolvers['credentials']>(
  async ({ parent: { id }, scope, userId }) => {
    if (!scopeDiff(scope, 'ADMIN') && userId !== id) throw scopeError();

    return (await passwordless.listCredentials(id)).map(parseCredential);
  }
);

export const getUserAvatarUrl = h<UserResolvers['avatarUrl']>(
  ({ parent: { email } }) => {
    const hash = createHash('sha256')
      .update(email.trim().toLowerCase())
      .digest('hex');
    const url = `https://gravatar.com/avatar/${hash}?s=256&d=https%3A%2F%2Fone.elmpoint.xyz%2Fmp.png`;

    return url;
  }
);

export const getUserScope = h<UserResolvers['scope']>(
  ({ parent: { scope, id }, scope: requesterScope, userId }) => {
    if (!scopeDiff(requesterScope, 'ADMIN') && userId !== id)
      throw scopeError();
    return scope;
  }
);

// util: parse passwordless credential
function parseCredential(c: Credential) {
  return {
    ...c,
    id: c.descriptor.id,
    createdAt: c.createdAt?.toString(),
    lastUsedAt: c.lastUsedAt?.toString(),
  };
}
