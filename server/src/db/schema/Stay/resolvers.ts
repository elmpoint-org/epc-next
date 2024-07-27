import type { StayModule } from './__types/module-types';

import { timestamp } from '@@/db/lib/utilities';

import * as f from './functions';

const resolvers: StayModule.Resolvers = {
  Query: {
    stays: f.getStays,
  },

  Stay: {
    timestamp,
  },
};
export default resolvers;
