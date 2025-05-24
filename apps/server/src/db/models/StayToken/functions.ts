import { StayTokenModule as M } from './__types/module-types';
import {
  err,
  getTypedScopeFunctions,
  handle as h,
  loggedIn,
  scopeError,
} from '##/db/lib/utilities.js';
import { ResolverContext } from '##/db/graph.js';
import { generateKey } from '##/util/generate.js';
import { STAY_TOKEN_CHAR_LENGTH } from '##/CONSTANTS.js';
import { DBStayToken } from './source';

const { scoped, scopeDiff } = getTypedScopeFunctions<ResolverContext>();

export const getStayTokens = h<M.QueryResolvers['stayTokens']>(
  scoped('ADMIN'),
  async ({ sources }) => {
    return sources.stayToken.getAll();
  }
);

export const getStayToken = h<M.QueryResolvers['stayToken']>(
  loggedIn(),
  async ({ sources, args: { id } }) => {
    return sources.stayToken.get(id);
  }
);

export const getStayTokensFromUser = h<M.QueryResolvers['stayTokensFromUser']>(
  async ({ sources, args: { userId }, scope, userId: actualUserId }) => {
    if (actualUserId !== userId && !scopeDiff(scope, 'ADMIN'))
      throw scopeError();
    return sources.stayToken.findBy('userId', userId);
  }
);

export const stayTokenValidate = h<M.QueryResolvers['stayTokenValidate']>(
  async ({ sources, args: { token } }) => {
    const found = await sources.stayToken.findBy('token', token);
    if (!found.length) throw err('INVALID_TOKEN');
    return found[0];
  }
);

export const stayTokenCreate = h<M.MutationResolvers['stayTokenCreate']>(
  loggedIn(),
  async ({ sources, args: { forceDuplicate }, userId }) => {
    const found = await sources.stayToken.findBy('userId', userId);
    if (found.length && !forceDuplicate) return found[0];

    if (!userId?.length) throw err('MISSING_USER');

    return sources.stayToken.create({
      userId: userId,
      token: await generateKey(STAY_TOKEN_CHAR_LENGTH),
    });
  }
);

export const stayTokenDelete = h<M.MutationResolvers['stayTokenDelete']>(
  async ({ sources, args: { id }, scope, userId }) => {
    const stayToken = await sources.stayToken.get(id);
    if (!stayToken) throw err('TOKEN_NOT_FOUND');

    if (stayToken.userId !== userId && !scopeDiff(scope, 'ADMIN'))
      throw scopeError();

    return sources.stayToken.delete(id);
  }
);

export const getStayTokenUser = h<M.StayTokenResolvers['user']>(
  async ({ sources, parent }) => {
    const { userId } = parent as DBStayToken;
    return sources.user.get(userId);
  }
);
