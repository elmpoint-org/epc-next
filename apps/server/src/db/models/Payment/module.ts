import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const PaymentModule = createModule({
  id: 'Payment',
  dirname: __dirname,
  typeDefs,
  resolvers,
});
export default PaymentModule;
