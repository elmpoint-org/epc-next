import { parse } from 'graphql';
import { createModule } from 'graphql-modules';

import sdl from './types.graphql';
import resolvers from './resolvers';

const UserModule = createModule({
  id: 'User',
  dirname: __dirname,
  typeDefs: parse(sdl),
  resolvers,
});

export default UserModule;

// -----------------------------

// ts assert: `UserPublicFacing` must extend `User`
import type { UserModule as M } from './__types/module-types';
type PublicFacingFields = Exclude<keyof M.UserPublicFacing, '__typename'>;
type IsSubsetOfUser =
  Omit<M.UserPublicFacing, '__typename'> extends Pick<
    M.User,
    PublicFacingFields
  >
    ? true
    : never;
const _assertUserPublicFacingSubset: IsSubsetOfUser = true;
_assertUserPublicFacingSubset;
