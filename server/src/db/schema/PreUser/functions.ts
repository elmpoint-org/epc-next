import { MutationResolvers, QueryResolvers } from '@@/db/__types/graphql-types';
import { ResolverContext } from '@@/db/graph';
import { err, getTypedScopeFunctions, handle as h } from '@@/db/lib/utilities';

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
    const u = await sources.preUser.findBy('email', email);
    return u[0] ?? null;
  }
);

export const createPreUser = h<MutationResolvers['createPreUser']>(
  scoped('ADMIN'),
  ({ sources, args: newPreUser }) => {
    return sources.preUser.create(newPreUser);
  }
);

export const updatePreUser = h<MutationResolvers['updatePreUser']>(
  scoped('ADMIN'),
  async ({ sources, args: { id, ...updates } }) => {
    // ensure item exists
    const u = await sources.preUser.get(id);
    if (!u) throw err('USER_NOT_FOUND');

    return sources.preUser.update(id, updates);
  }
);

export const deletePreUser = h<MutationResolvers['deletePreUser']>(
  scoped('ADMIN'),
  async ({ sources, args: { id } }) => {
    const u = await sources.preUser.get(id);
    if (!u) throw err('USER_NOT_FOUND');

    return sources.preUser.delete(id);
  }
);
