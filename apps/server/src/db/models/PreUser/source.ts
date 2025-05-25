import { PreUser } from '##/db/__types/graphql-types.js';
import Model from '##/db/lib/Model.js';

export type DBPreUser = PreUser & {
  //
};

class PreUserSource extends Model<DBPreUser> {
  protected table = 'epc--users';
  protected type = 'pre-user';
}

export default PreUserSource;
