import { Room } from '##/db/__types/graphql-types.js';
import Model from '##/db/lib/Model.js';

import { ROOT_CABIN_ID as RCI } from '@epc/types/cabins';

export type DBRoom = Room & {
  cabinId: string;
};

class RoomSource extends Model<DBRoom> {
  protected table = 'epc--rooms';
  protected type = 'room';
}
export default RoomSource;

export const ROOT_CABIN_ID = RCI;
