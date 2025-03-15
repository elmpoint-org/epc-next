import Model from '@@/db/lib/Model';
import type { Stay } from '@@/db/__types/graphql-types';

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
