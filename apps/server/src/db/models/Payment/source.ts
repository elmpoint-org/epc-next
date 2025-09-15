import Model from '##/db/lib/Model.js';
import { Payment } from '##/db/__types/graphql-types.js';

export type DBPayment = {
  userId: string;
  stripeTransactionId?: string;
} & Payment;

class PaymentSource extends Model<DBPayment> {
  protected table = 'epc--payment';
  protected type = 'payment';
}
export default PaymentSource;
