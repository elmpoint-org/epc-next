import {
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  NotFound,
  DeleteObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
  S3ServiceException,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl as presign } from '@aws-sdk/s3-request-presigner';

import mime from 'mime/lite';
import type { MimeType } from '@@/util/mimeTypes';

import { FILE_GET_PRESIGN_EXPIRE, UPLOAD_PRESIGN_EXPIRE } from '@@/CONSTANTS';
import { getDateSec } from '@@/util/time';
import { PATH_UNKNOWN_STRING } from './FILE_TYPES';

export enum Buckets {
  EPC_ONE = 'epc-one',
  RESOURCE_BUCKET = 'epc-resources',
}

const s3 = new S3Client();

export type FilePath = { bucket: Buckets; path: string };

type GetUploadUrlProps = {
  bucket: Buckets;
  path: string;
  // type:
  expiresSec?: number;
};
export async function getS3UploadUrl({
  bucket,
  path,
  expiresSec,
}: GetUploadUrlProps) {
  const params: PutObjectCommandInput = {
    StorageClass: 'INTELLIGENT_TIERING',
    Bucket: bucket,
    Key: path,
  };
  const url = await presign(s3, new PutObjectCommand(params), {
    expiresIn: expiresSec ?? UPLOAD_PRESIGN_EXPIRE,
  }).catch((err) => {
    return null;
  });
  if (!url) return { error: 'DB_ERROR' };
  return { data: url };
}

export async function uploadS3File(
  fp: FilePath,
  options?: Partial<PutObjectCommandInput>
) {
  return s3
    .send(
      new PutObjectCommand({
        StorageClass: 'INTELLIGENT_TIERING',
        Bucket: fp.bucket,
        Key: fp.path,
        ...options,
      })
    )
    .then(() => true)
    .catch((error) => {
      console.log(error);
      return false;
    });
}

export async function getSignedS3Url(
  uri: string,
  expiresSec?: number
): Promise<string | null>;
export async function getSignedS3Url(
  filePath: FilePath,
  expiresSec?: number
): Promise<string | null>;
export async function getSignedS3Url(
  p: string | FilePath,
  expiresSec?: number
) {
  let fp: FilePath;
  if (typeof p === 'string') {
    // parse S3 URI if needed
    const parsed = parseS3Uri(p);
    if (!parsed) return null;
    fp = parsed;
  } else fp = p;

  // run signing function
  return presignFile(fp, expiresSec).catch(() => null);
}

function presignFile(fp: FilePath, expiresSec?: number) {
  return presign(
    s3,
    new GetObjectCommand({
      Bucket: fp.bucket,
      Key: fp.path,
    }),
    {
      expiresIn: expiresSec ?? FILE_GET_PRESIGN_EXPIRE,
    }
  );
}

export function parseS3Uri(uri: string) {
  const m = uri?.match(/^s3:\/\/([^\/]+)\/(.+)$/);
  if (!m) return null;
  return {
    bucket: m[1],
    path: m[2],
  } as FilePath;
}
export function getS3Uri(fp: FilePath) {
  return `s3://${fp.bucket}/${fp.path}`;
}

export async function getS3File(fp: FilePath) {
  try {
    const { Body } = await s3.send(
      new GetObjectCommand({
        Bucket: fp.bucket,
        Key: fp.path,
      })
    );
    if (!Body) return null;
    return await Body.transformToByteArray();
  } catch (error) {
    console.log(error);
    return null;
  }
}

/** checks file type and, if valid, returns MIME type and standard file extension */
export function checkFileType(filename: string, ...types: MimeType[]) {
  const fileType = mime.getType(filename);
  if (!types.some((el) => el === fileType)) return null;
  const ext = mime.getExtension(fileType!);
  if (!ext) return null;

  return { type: fileType!, ext };
}

export async function doesFileExist(fp: FilePath) {
  const f = await s3
    .send(
      new HeadObjectCommand({
        Bucket: fp.bucket,
        Key: fp.path,
      })
    )
    .catch((err) => {
      if (err.name === NotFound.name) {
        return false;
      }
      throw err;
    });
  if (!f) return false;
  return true;
}

/**
 * delete a file
 * @throws usually an {@link S3ServiceException}
 */
export async function deleteS3File(fp: FilePath) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: fp.bucket,
      Key: fp.path,
    })
  );
}

export async function deleteS3Folder(fp: FilePath) {
  let deleted = 0; // number of files deleted
  const errors: { key: string; code: string }[] = [];

  let ContinuationToken: string | undefined;
  do {
    // list all files
    const files = await s3
      .send(
        new ListObjectsV2Command({
          Bucket: fp.bucket,
          Prefix: fp.path,
          ContinuationToken,
        })
      )
      .catch(() => {});
    if (files?.KeyCount && files.Contents) {
      const status = await s3
        .send(
          new DeleteObjectsCommand({
            Bucket: fp.bucket,
            Delete: {
              Objects: files.Contents.map((f) => ({ Key: f.Key })),
              Quiet: false,
            },
          })
        )
        .catch(() => {});
      deleted += status?.Deleted?.length ?? 0;
      if (status?.Errors)
        status.Errors.map(({ Key, Code }) => {
          if (Key && Code) errors.push({ key: Key, code: Code });
        });

      // recurse if necessary
      if (files.NextContinuationToken)
        ContinuationToken = files.NextContinuationToken;
    }
  } while (ContinuationToken);

  return { deleted, errors };
}

export async function listS3Files(
  bucket: Buckets,
  folder?: string,
  paged?: {
    /** max number of items to return */
    max?: number;
    /** the last key returned in the last request */
    start?: string;
  }
) {
  const objects = await s3
    .send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: folder,
        MaxKeys: paged?.max,
        StartAfter: paged?.start,
      })
    )
    .catch(() => null); // TODO get error
  if (!objects) return null;

  const list =
    objects.Contents?.map((it) => ({
      path: it.Key ?? PATH_UNKNOWN_STRING,
      lastModified: getDateSec(it.LastModified) ?? undefined,
      size: it.Size,
    })) ?? null;

  return { data: list, isComplete: !objects.IsTruncated };
}

/**
 * move or copy (or rename) a file
 * @throws usually an {@link S3ServiceException}
 */
export async function moveS3File({
  bucket,
  path,
  newPath,
  deleteOld,
}: {
  bucket: Buckets;
  path: string;
  newPath: string;
  deleteOld?: boolean;
}) {
  await s3.send(
    new CopyObjectCommand({
      Bucket: bucket,
      CopySource: bucket + '/' + path,
      Key: newPath,
    })
  );
  if (deleteOld)
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: path,
      })
    );
}

/**
 * create a new empty folder object.
 * @throws usually an {@link S3ServiceException}
 */
export async function createS3Folder(bucket: Buckets, folder: string) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: folder,
    })
  );
}
