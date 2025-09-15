import Model from '##/db/lib/Model.js';
import { Payment } from '##/db/__types/graphql-types.js';

export type DBPayment = {} & Payment;

class PaymentSource extends Model<DBPayment> {
  protected table = '';
  protected type = '';
}
export default PaymentSource;
