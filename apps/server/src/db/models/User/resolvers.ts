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
    userLogLogin: f.userLogLogin,
  },
  User: {
    credentials: f.getUserCredentials,
    avatarUrl: f.getUserAvatarUrl,
    scope: f.getUserScope,
    trustedUsers: f.getUserTrustedUsers,
    trustedBy: f.getUserTrustedBy,
    trustsYou: f.getUserTrustsYou,
    cooldowns: f.getUserCooldowns,
    invitedBy: f.getUserInvitedBy,

    timestamp,
  },
  UserPublicFacing: {
    // `User` resolvers are safe to reuse here--
    // the runtime parent is always a full user record
    avatarUrl: f.getUserAvatarUrl as any,
  },
};

export default resolvers;
