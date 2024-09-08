import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const StayTokenModule = createModule({
  id: 'StayToken',
  dirname: __dirname,
  typeDefs,
  resolvers,
});

export default StayTokenModule;
