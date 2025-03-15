import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const UserModule = createModule({
  id: 'User',
  dirname: __dirname,
  typeDefs,
  resolvers,
});

export default UserModule;
