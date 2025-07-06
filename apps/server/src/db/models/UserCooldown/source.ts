import Model from '##/db/lib/Model.js';
import { UserCooldown } from '##/db/__types/graphql-types.js';

export type DBUserCooldown = {
  userId: string;
} & UserCooldown;

class UserCooldownSource extends Model<DBUserCooldown> {
  protected table = 'epc--auth';
  protected type = 'user-cooldown';
}
export default UserCooldownSource;
