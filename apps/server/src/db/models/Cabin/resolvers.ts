import type { CabinModule } from './__types/module-types';

import * as f from './functions';

import { timestamp } from '##/db/lib/utilities.js';

const resolvers: CabinModule.Resolvers = {
  Query: {
    cabins: f.getCabins,
    cabin: f.getCabin,
  },
  Mutation: {
    cabinCreate: f.cabinCreate,
    cabinCreateMultiple: f.cabinCreateMultiple,
    cabinUpdate: f.cabinUpdate,
    cabinDelete: f.cabinDelete,
  },

  Cabin: {
    rooms: f.getCabinRooms,

    timestamp,
  },
};
export default resolvers;
