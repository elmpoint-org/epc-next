import { CmsImageModule } from './__types/module-types';
import { timestamp } from '@@/db/lib/utilities';

import * as f from './functions';

const resolvers: CmsImageModule.Resolvers = {
  Query: {
    cmsImages: f.getCmsImages,
    cmsImage: f.getCmsImage,
  },
  Mutation: {
    cmsImageUpload: f.cmsImageUpload,
    cmsImageConfirm: f.cmsImageConfirm,
    cmsImageUpdate: f.cmsImageUpdate,
    cmsImageDelete: f.cmsImageDelete,
  },

  CMSImage: {
    author: f.getCmsImageAuthor,
    url: f.getCmsImageUrl,

    timestamp,
  },
};
export default resolvers;
