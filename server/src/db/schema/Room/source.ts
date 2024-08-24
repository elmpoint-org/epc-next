import { Room } from '@@/db/__types/graphql-types';
import Model from '@@/db/lib/Model';

export type DBRoom = Room & {
  cabinId: string;
};

class RoomSource extends Model<DBRoom> {
  protected table = 'epc--rooms';
  protected type = 'room';
}
export default RoomSource;

export const ROOT_CABIN_ID = 'ROOT';
