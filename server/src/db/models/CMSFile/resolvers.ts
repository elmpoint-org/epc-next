import { CmsFileModule } from './__types/module-types';

import * as f from './functions';

const resolvers: CmsFileModule.Resolvers = {
  Query: {
    cmsFiles: f.getCmsFiles,
    cmsFilePresign: f.getCmsFilePresign,
  },
  Mutation: {
    cmsFileUpload: f.cmsFileUpload,
    cmsFileCreateFolder: f.cmsFileCreateFolder,
    cmsFileMove: f.cmsFileMove,
    cmsFileDelete: f.cmsFileDelete,
  },
};

export default resolvers;
