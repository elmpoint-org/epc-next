import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const CMSFileModule = createModule({
  id: 'CMSFile',
  dirname: __dirname,
  typeDefs,
  resolvers,
});
export default CMSFileModule;
