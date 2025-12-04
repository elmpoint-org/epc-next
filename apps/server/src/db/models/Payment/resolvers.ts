import { PaymentModule } from './__types/module-types';
import { timestamp } from '##/db/lib/utilities.js';

const resolvers: PaymentModule.Resolvers = {
  Payment: {
    timestamp,
  },
};

export default resolvers;
