import { UserResolvers } from '@/db/__types/graphql-types';
import type { UserModule } from './__types/module-types';
import * as f from './functions';

import {
  getTypedScopeFunctions,
  handle as h,
  scoped,
  timestamp,
} from '@/db/lib/utilities';
import { ResolverContext } from '@/db/graph';

const resolvers: UserModule.Resolvers = {
  Query: {
    users: f.getUsers,
    user: f.getUser,
    userFromAuth: f.getUserFromAuth,
    userFromEmail: f.getUserFromEmail,
    userSECURE: f.getUserSECURE,
  },
  Mutation: {
    userCreate: f.userCreate,
    userUpdate: f.userUpdate,
    userDelete: f.userDelete,
    userResetSecret: f.userResetSecret,
  },
  User: {
    credentials: f.getUserCredentials,

    timestamp,
  },
};

export default resolvers;
