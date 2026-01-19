import { timestamp } from '##/db/lib/utilities.js';
import { PreUserModule } from './__types/module-types';

import * as f from './functions';

const resolvers: PreUserModule.Resolvers = {
  Query: {
    preUsers: f.getPreUsers,
    preUser: f.getPreUser,
    preUserFromEmail: f.getPreUserFromEmail,
  },
  Mutation: {
    preUserCreate: f.preUserCreate,
    preUserCreateMultiple: f.preUserCreateMultiple,
    preUserUpdate: f.preUserUpdate,
    preUserDelete: f.preUserDelete,
  },
  PreUser: {
    cooldowns: f.getPreUserCooldowns,
    invitedBy: f.getPreUserInvitedBy,

    timestamp,
  },
};

export default resolvers;
