import Model from '##/db/lib/Model.js';
import { CmsContentModule } from './__types/module-types';

export type DBCMSBanner = CmsContentModule.CMSBanner & {
  authorId: string;
};
export class CMSBannerSource extends Model<DBCMSBanner> {
  protected table = 'epc-one--cms';
  protected type = 'banner';
}
