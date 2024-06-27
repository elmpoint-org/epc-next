import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const CMSPageModule = createModule({
  id: 'CMSPage',
  dirname: __dirname,
  typeDefs,
  resolvers,
});
export default CMSPageModule;
