import Model from '##/db/lib/Model.js';

import type { User } from '##/db/__types/graphql-types.js';

export type DBUser = User & {
  secret: string;
  trustedUserIds?: string[];
  invitedById?: string;
};

class UserSource extends Model<DBUser> {
  protected table = 'epc--users';
  protected type = 'user';
}

export default UserSource;
