import { DEFAULT_MAX_FILES_LIST_LIMIT } from '##/CONSTANTS.js';
import type { CmsFileModule as M } from './__types/module-types';
import type { ResolverContext } from '##/db/graph.js';

import {
  err,
  getTypedScopeFunctions,
  handle as h,
  loggedIn,
} from '##/db/lib/utilities.js';

import { BUCKET } from '##/s3/files.js';
import { s3 } from '##/s3/index.js';

const { scoped, scopeDiff } = getTypedScopeFunctions<ResolverContext>();

export const getCmsFiles = h<M.QueryResolvers['cmsFiles']>(
  loggedIn(),
  async ({ args: { root, startAfter, max, recursive } }) => {
    // validate args
    if (root) {
      if (!root.match(/^\w/)) throw err('BAD_FOLDER_NAME');
      if (!root.match(/\/$/)) throw err('ROOT_FOLDER_MISSING_TRAILING_SLASH');
    }

    // get files list
    const resp = await s3.listFiles(BUCKET, root ?? undefined, {
      max: max ?? DEFAULT_MAX_FILES_LIST_LIMIT,
      start: startAfter ?? undefined,
    });
    let list = resp?.data ?? [];

    const isInDirectory = (path: string) =>
      !path.slice(root?.length).match(/\/.+$/);

    // filter to current directory only
    if (!recursive && resp?.data)
      list = resp.data.filter((it, i) => {
        if (it.path === root) return false;
        return isInDirectory(it.path);
      });

    return { files: list, isComplete: resp?.isComplete ?? false };
  }
);

export const getCmsFilePresign = h<M.QueryResolvers['cmsFilePresign']>(
  loggedIn(),
  async ({ args: { path } }) => {
    return s3.getSignedUrl({ bucket: BUCKET, path });
  }
);

export const cmsFileUpload = h<M.MutationResolvers['cmsFileUpload']>(
  scoped('ADMIN', 'EDIT'),
  async ({ args: { fileName, root } }) => {
    // validate args
    if (root.length) {
      if (!root.match(/^\w/)) throw err('BAD_FOLDER_NAME');
      if (!root.match(/\/$/)) throw err('ROOT_FOLDER_MISSING_TRAILING_SLASH');
    }

    // generate filepath
    const name = fileName.trim().match(/([^\/]*\.[^\.]+)$/)?.[1];
    if (!name?.length) throw err('BAD_FILENAME');
    const fp = {
      bucket: BUCKET,
      path: root + name,
    };

    // presign upload url
    const { data, error } = await s3.getUploadUrl(fp);
    if (error || !data) throw err('PRESIGN_FAILED');

    // create folder if it doesn't already exist
    const folder_exists = await s3
      .doesFileExist({
        bucket: BUCKET,
        path: root,
      })
      .catch(() => null);
    if (folder_exists === false) await s3.createFolder(BUCKET, root);

    return { uri: s3.getUri(fp), url: data };
  }
);

export const cmsFileCreateFolder = h<
  M.MutationResolvers['cmsFileCreateFolder']
>(
  scoped('ADMIN', 'EDIT'), //
  async ({ args: { root } }) => {
    // validate folder name
    if (!root.length) return true; // "creates" the root folder
    if (!root.match(/^\w/)) throw err('BAD_FOLDER_NAME');
    if (!root.match(/\/$/)) throw err('ROOT_FOLDER_MISSING_TRAILING_SLASH');

    await s3.createFolder(BUCKET, root).catch((e) => {
      throw err('S3_ERROR', undefined, e);
    });

    return true;
  }
);

export const cmsFileMove = h<M.MutationResolvers['cmsFileMove']>(
  scoped('ADMIN', 'EDIT'),
  async ({ args: { changes, copy } }) => {
    let finished = 0;
    await Promise.all(
      changes.map(async ({ path, newPath }) => {
        await s3
          .moveFile({
            bucket: BUCKET,
            path,
            newPath,
            deleteOld: copy !== undefined ? !copy : true,
          })
          .then(() => finished++)
          .catch((e) => {
            err('', undefined, e);
          });
      })
    );

    return finished;
  }
);

export const cmsFileDelete = h<M.MutationResolvers['cmsFileDelete']>(
  scoped('ADMIN', 'EDIT'),
  async ({ args: { paths } }) => {
    await Promise.all(
      paths.map(async (path) => {
        path = path.trim();
        if (path.at(-1) === '/') {
          const { errors } = await s3.deleteFolder({ bucket: BUCKET, path });
          if (errors.length) throw err('FAILED_ITEMS', JSON.stringify(errors));
        } else {
          await s3.deleteFile({ bucket: BUCKET, path }).catch(() => {});
        }
      })
    );

    return true;
  }
);
