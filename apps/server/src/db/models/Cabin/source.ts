import { Cabin } from '@@/db/__types/graphql-types';
import Model from '@@/db/lib/Model';

export type DBCabin = Cabin & {
  //
};

class CabinSource extends Model<DBCabin> {
  protected table = 'epc--rooms';
  protected type = 'cabin';
}
export default CabinSource;
