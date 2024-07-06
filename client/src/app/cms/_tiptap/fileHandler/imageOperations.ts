'use client';

import { graphql, graphAuth } from '@/query/graphql';

export async function uploadImage(file: File) {
  // request presigned uploader url
  const { id, url: uploadUrl } = await getUploadUrl(file.name);

  // upload file
  await uploadFile(uploadUrl, file);

  // confirm upload
  const { url } = await confirmUpload(id);

  return url;
}

export async function getSignedImage(id: string) {
  // TODO should there be a `cmsImagesMultiple` for batch get?
  const { data, errors } = await graphAuth(
    graphql(`
      query CmsImage($id: ID!) {
        cmsImage(id: $id) {
          url
        }
      }
    `),
    { id },
  );
  if (errors || !data?.cmsImage) throw errors?.[0].code || 'IMAGE_GET_FAILED';
}

// ---------------------------

async function getUploadUrl(fileName: string) {
  const { data, errors } = await graphAuth(
    graphql(`
      mutation CmsImageUpload($fileName: String!) {
        cmsImageUpload(fileName: $fileName) {
          id
          url
        }
      }
    `),
    { fileName },
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
    // TODO need to access "public" attribute here
    graphql(`
      mutation CmsImageConfirm($id: ID!) {
        cmsImageConfirm(id: $id) {
          url
        }
      }
    `),
    { id },
  );
  if (errors || !data?.cmsImageConfirm)
    throw errors?.[0]?.code || 'FAILED_CONFIRMATION_STEP';

  return data.cmsImageConfirm;
}
