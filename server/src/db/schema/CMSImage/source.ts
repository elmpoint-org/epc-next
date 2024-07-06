import Model from '@@/db/lib/Model';
import type { CmsImage } from '@@/db/__types/graphql-types';

export type DBCmsImage = CmsImage & {
  authorId: string;
};

class CMSImageSource extends Model<DBCmsImage> {
  protected table = 'epc--cms-resources';
  protected type = 'image';
}
export default CMSImageSource;
