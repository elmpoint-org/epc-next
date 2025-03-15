import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const CMSImageModule = createModule({
  id: 'CMSImage',
  dirname: __dirname,
  typeDefs,
  resolvers,
});
export default CMSImageModule;
