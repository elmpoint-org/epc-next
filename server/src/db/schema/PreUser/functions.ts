import { MutationResolvers, QueryResolvers } from '@@/db/__types/graphql-types';
import { ResolverContext } from '@@/db/graph';
import {
  err,
  getTypedScopeFunctions,
  handle as h,
  scopeError,
} from '@@/db/lib/utilities';
import { prepEmail } from '@@/util/textTransform';

const { scoped } = getTypedScopeFunctions<ResolverContext>();

export const getPreUsers = h<QueryResolvers['preUsers']>(
  scoped('ADMIN'),
  ({ sources }) => {
    return sources.preUser.getAll();
  }
);

export const getPreUser = h<QueryResolvers['preUser']>(
  scoped('ADMIN'),
  ({ sources, args: { id } }) => {
    return sources.preUser.get(id);
  }
);

export const getPreUserFromEmail = h<QueryResolvers['preUserFromEmail']>(
  scoped('ADMIN'),
  async ({ sources, args: { email } }) => {
    const u = await sources.preUser.findBy('email', prepEmail(email));
    return u[0] ?? null;
  }
);

export const preUserCreate = h<MutationResolvers['preUserCreate']>(
  async ({ sources, args: newPreUser, userId }) => {
    if (!userId) throw scopeError();

    newPreUser.email = prepEmail(newPreUser.email);

    const pu = await sources.preUser.findBy('email', newPreUser.email);
    if (pu.length) throw err('USER_ALREADY_INVITED');
    const u = await sources.user.findBy('email', newPreUser.email);
    if (u.length) throw err('USER_ALREADY_EXISTS');

    return sources.preUser.create(newPreUser);
  }
);

export const preUserUpdate = h<MutationResolvers['preUserUpdate']>(
  scoped('ADMIN'),
  async ({ sources, args: { id, ...updates } }) => {
    // ensure item exists
    const u = await sources.preUser.get(id);
    if (!u) throw err('USER_NOT_FOUND');

    return sources.preUser.update(id, updates);
  }
);

export const preUserDelete = h<MutationResolvers['preUserDelete']>(
  scoped('ADMIN'),
  async ({ sources, args: { id } }) => {
    const u = await sources.preUser.get(id);
    if (!u) throw err('USER_NOT_FOUND');

    await sources.preUser.delete(id);
    return u;
  }
);
