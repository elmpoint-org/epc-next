import { ResolverContext } from '@/db/graph';

export type ScopeObject = ResolverContext['scope'];

export const getScopeObject = (scope: (keyof ScopeObject)[]) =>
  scope.reduce((obj, nv) => ({ ...obj, [nv]: true }), {} as ScopeObject);
