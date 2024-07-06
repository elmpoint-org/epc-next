import {
  err,
  getTypedScopeFunctions,
  handle as h,
  scopeError,
} from '@@/db/lib/utilities';
import type { ResolverContext } from '@@/db/graph';
import type { CmsImageModule as M } from './__types/module-types';
import type { CmsImage } from '@@/db/__types/graphql-types';
import type { DBCmsImage } from './source';
import type { DBType } from '@@/db/lib/Model';

import { BUCKET, PATH, checkImageType } from '@@/s3/images';
import {
  deleteS3File,
  doesFileExist,
  getS3Uri,
  getSignedS3Url,
  getUploadUrl,
  parseS3Uri,
} from '@@/s3/s3';

import { randomUUID as uuid } from 'node:crypto';

const { scoped, scopeDiff } = getTypedScopeFunctions<ResolverContext>();

export const getCmsImages = h<M.QueryResolvers['cmsImages']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources }) => {
    return sources.cms.image.getAll();
  }
);

export const getCmsImage = h<M.QueryResolvers['cmsImage']>(
  async ({ sources, args: { id }, userId }) => {
    const img = await sources.cms.image.get(id);

    // check scope based on `public` prop
    if (!(img?.public || userId)) throw scopeError();

    return img;
  }
);

export const cmsImageUpload = h<M.MutationResolvers['cmsImageUpload']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { fileName }, userId }) => {
    // verify file type
    const imageType = checkImageType(fileName);
    if (!imageType) throw err('INVALID_FILE_FORMAT');

    // generate image properties
    const id = uuid();
    const fp = {
      bucket: BUCKET,
      path: PATH + `${id}.${imageType.ext}`,
    };
    const uri = getS3Uri(fp);
    const name = fileName.trim().match(/(.*)\.[^\.]+$/)?.[1];

    // create DB entry
    await sources.cms.image
      .create({
        confirmed: false,
        authorId: userId,

        id,
        uri,
        name: name,
        ext: imageType.ext,
        mime: imageType.type,

        // defaults...
        public: false,
      } as DBCmsImage)
      .catch((error) => {
        throw err('SERVER_ERROR', undefined, error);
      });

    // presign upload url
    const { data, error } = await getUploadUrl(fp);
    if (error || !data) throw err('PRESIGN_FAILED');

    return { id, url: data };
  }
);

export const cmsImageConfirm = h<M.MutationResolvers['cmsImageConfirm']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { id, public: isPublic } }) => {
    // make sure id is valid
    const img = await sources.cms.image.get(id);
    if (!img) throw err('INVALID_ID');

    // check to make sure the file exists
    const fp = parseS3Uri(img.uri);
    if (!fp) throw err('INVALID_URI');
    const exists = await doesFileExist(fp).catch((err) => {
      throw err('FAILED_TO_CONFIRM', err);
    });
    if (!exists) throw err('FILE_NOT_FOUND');

    // if confirmed, update the db entry
    const updates: Partial<CmsImage> = { confirmed: true };
    if (typeof isPublic === 'boolean') updates.public = isPublic;

    return sources.cms.image.update(id, updates);
  }
);

export const cmsImageUpdate = h<M.MutationResolvers['cmsImageUpdate']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { id, ...updates } }) => {
    const img = await sources.cms.image.get(id);
    if (!img) throw err('IMAGE_NOT_FOUND');

    return sources.cms.image.update(id, updates);
  }
);

export const cmsImageDelete = h<M.MutationResolvers['cmsImageDelete']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { id } }) => {
    const img = await sources.cms.image.get(id);
    if (!img) throw err('IMAGE_NOT_FOUND');

    const fp = parseS3Uri(img.uri);
    if (!fp) throw err('INVALID_URI');

    await deleteS3File(fp).catch((error) => {
      throw err('FAILED_TO_DELETE', undefined, error);
    });

    return sources.cms.image.delete(id);
  }
);

export const getCmsImageAuthor = h<M.CMSImageResolvers['author']>(
  async ({ sources, parent }) => {
    const { authorId } = parent as DBType<DBCmsImage>;

    return sources.user.get(authorId);
  }
);

export const getCmsImageUrl = h<M.CMSImageResolvers['url']>(
  async ({ parent: { uri } }) => {
    const url = await getSignedS3Url(uri);
    if (!url) throw err('FAILED_TO_SIGN_URL');

    return url;
  }
);
