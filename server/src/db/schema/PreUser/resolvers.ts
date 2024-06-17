import { timestamp } from '@@/db/lib/utilities';
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
    preUserUpdate: f.preUserUpdate,
    preUserDelete: f.preUserDelete,
  },
  PreUser: {
    timestamp,
  },
};

export default resolvers;
