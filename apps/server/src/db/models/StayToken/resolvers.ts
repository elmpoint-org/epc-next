import { StayTokenModule } from './__types/module-types';
import * as f from './functions';

import { timestamp } from '##/db/lib/utilities.js';

const resolvers: StayTokenModule.Resolvers = {
  Query: {
    stayTokens: f.getStayTokens,
    stayToken: f.getStayToken,
    stayTokensFromUser: f.getStayTokensFromUser,
    stayTokenValidate: f.stayTokenValidate,
  },
  Mutation: {
    stayTokenCreate: f.stayTokenCreate,
    stayTokenDelete: f.stayTokenDelete,
  },

  StayToken: {
    user: f.getStayTokenUser,

    timestamp,
  },
};

export default resolvers;
