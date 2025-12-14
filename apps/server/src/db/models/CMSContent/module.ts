import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const CMSContentModule = createModule({
  id: 'CMSContent',
  dirname: __dirname,
  typeDefs,
  resolvers,
});
export default CMSContentModule;
