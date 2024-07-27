import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const StayModule = createModule({
  id: 'Stay',
  dirname: __dirname,
  typeDefs,
  resolvers,
});
export default StayModule;
