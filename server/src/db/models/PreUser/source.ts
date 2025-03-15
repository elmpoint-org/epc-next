import { PreUser } from '@@/db/__types/graphql-types';
import Model from '@@/db/lib/Model';

export type DBPreUser = PreUser & {
  //
};

class PreUserSource extends Model<DBPreUser> {
  protected table = 'epc--users';
  protected type = 'pre-user';
}

export default PreUserSource;
