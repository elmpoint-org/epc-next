import { parse } from 'graphql';
import { createModule } from 'graphql-modules';

import sdl from './types.graphql';
import resolvers from './resolvers';

const CMSImageModule = createModule({
  id: 'CMSImage',
  dirname: __dirname,
  typeDefs: parse(sdl),
  resolvers,
});
export default CMSImageModule;
