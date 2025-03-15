import Model from '@@/db/lib/Model';

import type { User } from '@@/db/__types/graphql-types';

export type DBUser = User & {
  secret: string;
  trustedUserIds?: string[];
};

class UserSource extends Model<DBUser> {
  protected table = 'epc--users';
  protected type = 'user';
}

export default UserSource;
