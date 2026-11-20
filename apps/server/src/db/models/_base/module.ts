import { parse } from 'graphql';
import { createModule } from 'graphql-modules';

import sdl from './types.graphql';
// import resolvers from './resolvers';

const Module = createModule({
  id: '_base',
  dirname: __dirname,
  typeDefs: [parse(sdl)],
  // resolvers,
});

export default Module;
