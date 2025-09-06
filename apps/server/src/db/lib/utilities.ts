import { ExecutionResult, GraphQLError } from 'graphql';

import type { DBType } from './Model';
import type { Resolver, ResolverFn } from '##/db/__types/graphql-types.js';
import type { Maybe } from 'graphql/jsutils/Maybe';
import type { ResolverContextType } from './executors';
import { PromiseOrValue } from 'graphql/jsutils/PromiseOrValue';

import { initGraphQLTada } from 'gql.tada';
import type { introspection } from '#schema';
import { MaybePromise } from '##/util/types.js';

export type GraphResponseType<T> = PromiseOrValue<
  ExecutionResult<T, { code?: string }>
>;

type Scope = Record<string, boolean>;
export type CtxExtended<T extends ResolverFn<any, any, any, any>> =
  Parameters<T>[2] & {
    parent: Parameters<T>[0];
    args: Parameters<T>[1];
  };

export const err = (code: string, msg?: string, log?: unknown) => {
  msg = msg || `Error code: ${code}`;
  if (log) console.log(log);
  return new GraphQLError(msg, { extensions: { code } });
};

export const errt = (...p: Parameters<typeof err>) => {
  throw err(...p);
};

// scope checking functions
export const scopeError = () => err('NEED_PERMISSION');
export const scopeDiff = (scope: Scope, required: string) => {
  if (!scope) return false;
  const list = required.match(/[\w_]+/g);
  if (!list?.length) return false;
  for (const it of list) {
    if (scope[it]) return true;
  }
  return false;
};

/**
 * middleware scope checker: pass in the required scope to be checked against the current context.
 *
 * @param scope a string of allowed scopes, separated by any character(s)
 * @returns a checker function that returns undefined if valid, or throws an error if invalid
 */
export const scoped =
  (scope: string) =>
  (
    ctx: CtxExtended<
      ResolverFn<unknown, unknown, ResolverContextType<unknown>, unknown>
    >
  ): undefined => {
    if (!scopeDiff(ctx.scope, scope)) throw scopeError();
  };

export const loggedIn =
  () =>
  (
    ctx: CtxExtended<
      ResolverFn<unknown, unknown, ResolverContextType<unknown>, unknown>
    >
  ): undefined => {
    if (!ctx.userId) throw scopeError();
  };

/**
 * get a typed version of scope functions by passing your context type
 * @returns scoped utility functions with your types
 * @example
 * export const scoped = getTypedScopeFunctions<ResolverContext>();
 */
export const getTypedScopeFunctions = <
  CtxType extends ResolverContextType<unknown>
>() => ({
  /**
   * typed middleware scope checker: pass in the required scope to be checked against the current context.
   *
   * @param s all allowed scopes, separated by any character(s)
   * @returns a checker function that returns undefined if valid, or throws an error if invalid
   */
  // scoped: (...s: (keyof CtxType['scope'])[]) => scoped(s.join(' ')),
  scoped: (...s: (keyof CtxType['scope'])[]) => scoped(s.join(' ')),

  /**
   * tests a scope object against required scopes. if ANY of the scopes match, returns true.
   * @param scope user's scope object to test
   * @param required list of scopes to check for
   * @returns true if scope matches
   */
  scopeDiff: (scope: Scope, ...required: (keyof CtxType['scope'])[]) =>
    scopeDiff(scope, required.join(' ')),
});

/**
 * template function for running callbacks over singular context object. pass as many callbacks as you'd like as arguments, and they will each receive the context object to work with. returning undefined will continue to the next callback function without exiting.
 *
 * @param callbacks [callback(ctx)]
 * @returns the first value you return from any callback
 */
export const handle = <T0 extends Resolver<any, any, any, any> | undefined>(
  ...callbacks: ((
    ctx: CtxExtended<Extract<T0, Function>>
  ) => MaybePromise<Maybe<ReturnType<Extract<T0, Function>>>>)[]
) => {
  type T = Extract<T0, Function>;

  return (async (
    parent: Parameters<T>[0],
    args: Parameters<T>[1],
    ctx: Parameters<T>[2]
  ) => {
    const extendedCtx = { ...ctx, parent, args };

    let out;
    for (const it of callbacks) {
      out = await it(extendedCtx);
      if (typeof out !== 'undefined') break;
    }

    return out;
  }) as unknown as T;
};

/** resolves timestamps from db form to graphql form. */
export const timestamp = ({
  tcreated: created,
  tupdated: updated,
}: Partial<DBType<any>>) =>
  ({
    created,
    updated,
  } as { created: number; updated: number });

export const graphql = initGraphQLTada<{
  introspection: introspection;
}>();
