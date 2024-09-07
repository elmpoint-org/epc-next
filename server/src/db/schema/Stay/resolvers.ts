import type { StayModule } from './__types/module-types';

import { timestamp } from '@@/db/lib/utilities';

import * as f from './functions';

const resolvers: StayModule.Resolvers = {
  Query: {
    stays: f.getStays,
    stay: f.getStay,
    staysInRoom: f.getStaysInRoom,
  },
  Mutation: {
    stayCreate: f.stayCreate,
    stayUpdate: f.stayUpdate,
    stayDelete: f.stayDelete,
    staySplit: f.staySplit,
  },

  Stay: {
    author: f.getStayAuthor,
    reservations: f.getStayReservations,

    timestamp,
  },

  CustomRoom: {
    __isTypeOf: f.isCustomRoomType,
  },
};
export default resolvers;
