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
import { s3 } from '@@/s3';

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

    // find whether page requires user auth
    let isPublic = false;
    const page = await sources.cms.page.get(img.pageId);
    if (page && !page.secure) isPublic = true;

    // verify user auth if needed
    if (!(isPublic || userId)) throw scopeError();

    return img;
  }
);

export const getCmsImagesFromPageId = h<
  M.QueryResolvers['cmsImagesFromPageId']
>(
  scoped('ADMIN', 'EDIT'), //
  async ({ sources, args: { pageId, confirmed } }) => {
    const page = await sources.cms.page.get(pageId);
    if (!page) throw err('PAGE_NOT_FOUND');

    let imgs = await sources.cms.image.findBy('pageId', pageId);

    // filter by confirmed if defined
    if (typeof confirmed === 'boolean') {
      imgs = imgs.filter((img) => !!img.confirmed === confirmed);
    }

    return imgs;
  }
);

export const cmsImageUpload = h<M.MutationResolvers['cmsImageUpload']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { fileName, pageId }, userId }) => {
    // verify file type
    const imageType = checkImageType(fileName);
    if (!imageType) throw err('INVALID_FILE_FORMAT');

    // verify page ID
    const page = await sources.cms.page.get(pageId);
    if (!page) throw err('PAGE_NOT_FOUND');

    // generate image properties
    const id = uuid();
    const fp = {
      bucket: BUCKET,
      path: PATH + `${id}.${imageType.ext}`,
    };
    const uri = s3.getUri(fp);
    const name = fileName.trim().match(/(.*)\.[^\.]+$/)?.[1];

    // create DB entry
    await sources.cms.image
      .create({
        confirmed: false,
        authorId: userId,
        pageId: page.id,

        id,
        uri,
        name: name,
        ext: imageType.ext,
        mime: imageType.type,
      } as DBCmsImage)
      .catch((error) => {
        throw err('SERVER_ERROR', undefined, error);
      });

    // presign upload url
    const { data, error } = await s3.getUploadUrl(fp);
    if (error || !data) throw err('PRESIGN_FAILED');

    return { id, url: data };
  }
);

export const cmsImageConfirm = h<M.MutationResolvers['cmsImageConfirm']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { id } }) => {
    // make sure id is valid
    const img = await sources.cms.image.get(id);
    if (!img) throw err('INVALID_ID');

    // check to make sure the file exists
    const fp = s3.parseUri(img.uri);
    if (!fp) throw err('INVALID_URI');
    const exists = await s3.doesFileExist(fp).catch((err) => {
      throw err('FAILED_TO_CONFIRM', err);
    });
    if (!exists) throw err('FILE_NOT_FOUND');

    // if confirmed, update the db entry
    const updates: Partial<CmsImage> = { confirmed: true };

    return sources.cms.image.update(id, updates);
  }
);

export const cmsImageUpdate = h<M.MutationResolvers['cmsImageUpdate']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { id, ...updates } }) => {
    const img = await sources.cms.image.get(id);
    if (!img) throw err('IMAGE_NOT_FOUND');

    // if author or page is defined, check that they are valid
    if (updates.authorId) {
      const author = await sources.user.get(updates.authorId);
      if (!author) throw err('USER_NOT_FOUND');
    }
    if (updates.pageId) {
      const page = await sources.cms.page.get(updates.pageId);
      if (!page) throw err('PAGE_NOT_FOUND');
    }

    return sources.cms.image.update(id, updates);
  }
);

export const cmsImageDelete = h<M.MutationResolvers['cmsImageDelete']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { id } }) => {
    const img = await sources.cms.image.get(id);
    if (!img) throw err('IMAGE_NOT_FOUND');

    const fp = s3.parseUri(img.uri);
    if (!fp) throw err('INVALID_URI');

    await s3.deleteFile(fp).catch((error) => {
      throw err('FAILED_TO_DELETE', undefined, error);
    });

    return sources.cms.image.delete(id);
  }
);

export const cmsImageDeleteMultiple = h<
  M.MutationResolvers['cmsImageDeleteMultiple']
>(
  scoped('ADMIN', 'EDIT'), //
  async ({ sources, args: { ids } }) => {
    const imgs = await sources.cms.image.getMultiple(ids);

    // attempt to delete images as well
    await Promise.all(
      imgs.map(async (img) => {
        const fp = s3.parseUri(img?.uri ?? '');
        if (!fp) return;
        await s3.deleteFile(fp).catch((error) => {
          throw err('FAILED_TO_DELETE', undefined, error);
        });
      })
    );

    await sources.cms.image.deleteMultiple(ids, /* output: */ false);
    return imgs.map((it) => it ?? null);
  }
);

export const cmsImageDeleteUnconfirmed = h<
  M.MutationResolvers['cmsImageDeleteUnconfirmed']
>(scoped('ADMIN', 'EDIT'), async ({ sources }) => {
  const images = await sources.cms.image.findBy('confirmed', 0);

  // attempt to delete images as well
  await Promise.all(
    images.map(async (img) => {
      const fp = s3.parseUri(img.uri);
      if (!fp) throw err('INVALID_URI');
      await s3.deleteFile(fp).catch((error) => {
        throw err('FAILED_TO_DELETE', undefined, error);
      });
    })
  );

  // delete db entries
  return Promise.all(images.map((img) => sources.cms.image.delete(img.id)));
});

export const getCmsImageAuthor = h<M.CMSImageResolvers['author']>(
  async ({ sources, parent }) => {
    const { authorId } = parent as DBType<DBCmsImage>;

    return sources.user.get(authorId);
  }
);

export const getCmsImagePage = h<M.CMSImageResolvers['page']>(
  async ({ sources, parent }) => {
    const { pageId } = parent as DBType<DBCmsImage>;

    return sources.cms.page.get(pageId);
  }
);

export const getCmsImageConfirmed = h<M.CMSImageResolvers['confirmed']>(
  async ({ parent }) => {
    return !!parent.confirmed;
  }
);

export const getCmsImageUrl = h<M.CMSImageResolvers['url']>(
  async ({ parent: { uri } }) => {
    const url = await s3.getSignedUrl(uri);
    if (!url) throw err('FAILED_TO_SIGN_URL');

    return url;
  }
);
