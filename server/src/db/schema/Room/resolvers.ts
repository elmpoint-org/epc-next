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
    roomCreateMultiple: f.roomCreateMultiple,
    roomUpdate: f.roomUpdate,
    roomDelete: f.roomDelete,
  },

  Room: {
    cabin: f.getRoomCabin,
    availableBeds: f.getRoomAvailableBeds,

    timestamp,
  },
};

export default resolvers;
