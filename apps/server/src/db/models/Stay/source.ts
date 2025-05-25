import Model from '##/db/lib/Model.js';
import type { Stay } from '##/db/__types/graphql-types.js';

export type DBStay = Stay & {
  authorId: string;
  reservationIds: ScalarRoom[];
};
export type ScalarRoom = {
  name: string;
  roomId?: string;
  customText?: string;
};

class StaySource extends Model<DBStay> {
  protected table = 'epc--calendar';
  protected type = 'stay';
}
export default StaySource;
