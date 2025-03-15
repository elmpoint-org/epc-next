import Model from '@@/db/lib/Model';
import { StayToken } from '@@/db/__types/graphql-types';

export type DBStayToken = {
  userId: string;
} & StayToken;

class StayTokenSource extends Model<DBStayToken> {
  protected table = 'epc--auth';
  protected type = 'staytoken';
}
export default StayTokenSource;
