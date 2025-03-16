import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const CabinModule = createModule({
  id: 'Cabin',
  dirname: __dirname,
  typeDefs,
  resolvers,
});
export default CabinModule;
