import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const PreUserModule = createModule({
  id: 'PreUser',
  dirname: __dirname,
  typeDefs,
  resolvers,
});

export default PreUserModule;
