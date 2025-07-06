import type { UserModule } from './__types/module-types';
import * as f from './functions';

import { timestamp } from '##/db/lib/utilities.js';

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
    userNotifUpdate: f.userNotifUpdate,
    userResetSecret: f.userResetSecret,
    userCreateCredential: f.userCreateCredential,
    userDeleteCredential: f.userDeleteCredential,
  },
  User: {
    credentials: f.getUserCredentials,
    avatarUrl: f.getUserAvatarUrl,
    scope: f.getUserScope,
    trustedUsers: f.getUserTrustedUsers,
    trustedBy: f.getUserTrustedBy,
    cooldowns: f.getUserCooldowns,

    timestamp,
  },
};

export default resolvers;
