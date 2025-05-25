import { timestamp } from '##/db/lib/utilities.js';
import type { CmsPageModule } from './__types/module-types';

import * as f from './functions';

const resolvers: CmsPageModule.Resolvers = {
  Query: {
    cmsPages: f.getCmsPages,
    cmsPage: f.getCmsPage,
    cmsPageFromSlug: f.getCmsPageFromSlug,
  },
  Mutation: {
    cmsPageCreate: f.cmsPageCreate,
    cmsPageUpdate: f.cmsPageUpdate,
    cmsPageDelete: f.cmsPageDelete,
  },

  CMSPage: {
    content: f.getCmsPageContent,
    contributors: f.getCmsPageContributors,

    timestamp,
  },
};
export default resolvers;
