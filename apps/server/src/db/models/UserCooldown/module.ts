import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const UserCooldownModule = createModule({
  id: 'UserCooldown',
  dirname: __dirname,
  typeDefs,
  resolvers,
});

export default UserCooldownModule;
