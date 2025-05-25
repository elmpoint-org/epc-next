import { Cabin } from '##/db/__types/graphql-types.js';
import Model from '##/db/lib/Model.js';

export type DBCabin = Cabin & {
  //
};

class CabinSource extends Model<DBCabin> {
  protected table = 'epc--rooms';
  protected type = 'cabin';
}
export default CabinSource;
