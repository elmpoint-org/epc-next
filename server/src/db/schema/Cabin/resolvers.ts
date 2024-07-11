import type { CabinModule } from './__types/module-types';

import * as f from './functions';

import { timestamp } from '@@/db/lib/utilities';

const resolvers: CabinModule.Resolvers = {
  Query: {
    cabins: f.getCabins,
    cabin: f.getCabin,
  },
  Mutation: {
    cabinCreate: f.cabinCreate,
    cabinUpdate: f.cabinUpdate,
    cabinDelete: f.cabinDelete,
  },

  Cabin: {
    rooms: f.getCabinRooms,

    timestamp,
  },
};
export default resolvers;
