import { CmsContentModule } from './__types/module-types';
import * as f from './functions';

import { timestamp } from '##/db/lib/utilities.js';

const resolvers: CmsContentModule.Resolvers = {
  Query: {
    cmsBanners: f.getCmsBanners,
    cmsBannersNow: f.getCmsBannersNow,
  },
  Mutation: {
    cmsBannerCreate: f.cmsBannerCreate,
    cmsBannerUpdate: f.cmsBannerUpdate,
    cmsBannerDelete: f.cmsBannerDelete,
    cmsBannerDeleteMultiple: f.cmsBannerDeleteMultiple,
  },
  CMSBanner: {
    author: f.getCmsBannerAuthor,
    timestamp,
  },
};

export default resolvers;
