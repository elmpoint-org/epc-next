import Model from '@@/db/lib/Model';
import type { CmsImage } from '@@/db/__types/graphql-types';

export type DBCmsImage = CmsImage & {
  authorId: string;
  pageId: string;
};

class CMSImageSource extends Model<DBCmsImage> {
  protected table = 'epc--cms-resources';
  protected type = 'image';

  protected schema(self: Model<DBCmsImage>, old?: boolean) {
    return (data: any) => {
      const obj = super.schema(self, old)(data);
      if (typeof obj.confirmed === 'boolean')
        obj.confirmed = (obj.confirmed ? 1 : 0) as any;
      return obj;
    };
  }
}
export default CMSImageSource;
