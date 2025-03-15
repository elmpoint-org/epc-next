import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const RoomModule = createModule({
  id: 'Room',
  dirname: __dirname,
  typeDefs,
  resolvers,
});
export default RoomModule;
