import type { UserModule } from './__types/module-types';
import * as f from './functions';

import { timestamp } from '@@/db/lib/utilities';

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
    userCreateCredential: f.userCreateCredential,
    userDeleteCredential: f.userDeleteCredential,
  },
  User: {
    credentials: f.getUserCredentials,

    timestamp,
  },
};

export default resolvers;
