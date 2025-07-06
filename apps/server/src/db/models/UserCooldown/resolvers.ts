import { timestamp } from '##/db/lib/utilities.js';
import { UserCooldownModule } from './__types/module-types';

import * as f from './functions';

const resolvers: UserCooldownModule.Resolvers = {
  Query: {
    userCooldown: f.getUserCooldown,
  },
  Mutation: {
    userCooldownUpdate: f.userCooldownUpdate,
    userCooldownPurge: f.userCooldownPurge,
  },

  UserCooldown: {
    user: f.getUserCooldownUser,
    timestamp,
  },
};
export default resolvers;
