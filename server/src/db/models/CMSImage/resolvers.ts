import { CmsImageModule } from './__types/module-types';
import { timestamp } from '@@/db/lib/utilities';

import * as f from './functions';

const resolvers: CmsImageModule.Resolvers = {
  Query: {
    cmsImages: f.getCmsImages,
    cmsImage: f.getCmsImage,
    cmsImagesFromPageId: f.getCmsImagesFromPageId,
  },
  Mutation: {
    cmsImageUpload: f.cmsImageUpload,
    cmsImageConfirm: f.cmsImageConfirm,
    cmsImageUpdate: f.cmsImageUpdate,
    cmsImageDelete: f.cmsImageDelete,
    cmsImageDeleteMultiple: f.cmsImageDeleteMultiple,
    cmsImageDeleteUnconfirmed: f.cmsImageDeleteUnconfirmed,
  },

  CMSImage: {
    author: f.getCmsImageAuthor,
    page: f.getCmsImagePage,
    confirmed: f.getCmsImageConfirmed,
    url: f.getCmsImageUrl,

    timestamp,
  },
};
export default resolvers;
