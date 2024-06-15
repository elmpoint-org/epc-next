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
    createPreUser: f.createPreUser,
    updatePreUser: f.updatePreUser,
    deletePreUser: f.deletePreUser,
  },
  PreUser: {
    timestamp,
  },
};

export default resolvers;
