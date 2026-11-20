import { parse } from 'graphql';
import { createModule } from 'graphql-modules';

import sdl from './types.graphql';
import resolvers from './resolvers';

const RoomModule = createModule({
  id: 'Room',
  dirname: __dirname,
  typeDefs: parse(sdl),
  resolvers,
});
export default RoomModule;
