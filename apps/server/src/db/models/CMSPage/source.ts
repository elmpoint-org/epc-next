import Model from '##/db/lib/Model.js';
import type { CmsPage } from '##/db/__types/graphql-types.js';

export type DBCmsPage = CmsPage & {
  contributorIds: string[];
};

class CMSPageSource extends Model<DBCmsPage> {
  protected table = 'epc--cms-pages';
  protected type = 'page';
}
export default CMSPageSource;
