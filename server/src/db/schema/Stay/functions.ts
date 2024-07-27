import type { StayModule as M } from './__types/module-types';

import { handle as h } from '@@/db/lib/utilities';

export const getStays = h<M.QueryResolvers['stays']>(async ({ sources }) => {
  // TODO time range
  return sources.stay.getAll();
});
