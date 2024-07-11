import type { RoomModule } from './__types/module-types';

import * as f from './functions';

import { timestamp } from '@@/db/lib/utilities';

const resolvers: RoomModule.Resolvers = {
  Query: {
    rooms: f.getRooms,
    room: f.getRoom,
    roomsFromCabin: f.getRoomsFromCabin,
  },
  Mutation: {
    roomCreate: f.roomCreate,
    roomUpdate: f.roomUpdate,
    roomDelete: f.roomDelete,
  },

  Room: {
    cabin: f.getRoomCabin,

    timestamp,
  },
};

export default resolvers;
