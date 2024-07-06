import {
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  NotFound,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl as presign } from '@aws-sdk/s3-request-presigner';

import mime from 'mime/lite';
import type { MimeType } from '@@/util/mimeTypes';

import { FILE_GET_PRESIGN_EXPIRE, UPLOAD_PRESIGN_EXPIRE } from '@@/CONSTANTS';

export enum Buckets {
  EPC_ONE = 'epc-one',
  RESOURCE_BUCKET = 'epc-resources',
}

const s3 = new S3Client();

type FilePath = { bucket: Buckets; path: string };

type GetUploadUrlProps = {
  bucket: Buckets;
  path: string;
  // type:
  expiresSec?: number;
};
export async function getUploadUrl({
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

export async function deleteS3File(fp: FilePath) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: fp.bucket,
      Key: fp.path,
    })
  );
}
