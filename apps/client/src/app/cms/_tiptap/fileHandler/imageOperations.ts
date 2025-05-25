'use client';

import { graphql, graphAuth } from '@/query/graphql';

export async function uploadImage(file: File, pageId: string) {
  // request presigned uploader url
  const { id, url: uploadUrl } = await getUploadUrl(file.name, pageId);

  // upload file
  await uploadFile(uploadUrl, file);

  // confirm upload
  await confirmUpload(id);

  const url = `/cms/image/${id}`;

  return url;
}

// ---------------------------

async function getUploadUrl(fileName: string, pageId: string) {
  const { data, errors } = await graphAuth(
    graphql(`
      mutation CmsImageUpload($fileName: String!, $pageId: String!) {
        cmsImageUpload(fileName: $fileName, pageId: $pageId) {
          id
          url
        }
      }
    `),
    { fileName, pageId },
  );
  if (errors || !data?.cmsImageUpload)
    throw errors?.[0]?.code || 'FAILED_TO_UPLOAD';

  return data.cmsImageUpload;
}

async function uploadFile(url: string, file: File) {
  await fetch(url, {
    method: 'PUT',
    body: file,
  }).catch((err) => {
    console.log('FAILED S3 UPLOAD', err);
    throw 'UPLOAD_FAILED';
  });
}

async function confirmUpload(id: string) {
  const { data, errors } = await graphAuth(
    graphql(`
      mutation CmsImageConfirm($id: ID!) {
        cmsImageConfirm(id: $id) {
          id
        }
      }
    `),
    { id },
  );
  if (errors || !data?.cmsImageConfirm)
    throw errors?.[0]?.code || 'FAILED_CONFIRMATION_STEP';

  return data.cmsImageConfirm;
}
