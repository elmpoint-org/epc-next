import dayjs from 'dayjs';

import { graph } from '##/db/graph.js';
import { graphql } from '##/db/lib/utilities.js';

import { WEBCAL_STALE_TIME } from '##/CONSTANTS.js';
import { s3 } from '##/s3/index.js';
import { Buckets } from '##/s3/s3.js';

const BUCKET = Buckets.RESOURCE_BUCKET;
const PATH = 'ics/';

export async function isCalStale(lastGen: number) {
  const now = dayjs().unix();

  // if more than the stale time has elapsed, force rebuild
  if (now - lastGen > WEBCAL_STALE_TIME) return true;

  // verify against recent stay date
  const mostRecent = await getStaysMostRecent(lastGen);
  if (!mostRecent) return false;
  if (mostRecent <= lastGen) return false;
  return true;
}

export async function getStaysMostRecent(after: number) {
  const { data, errors } = await graph(
    graphql(`
      query Query($after: Int!) {
        stayMostRecentTimestamp(after: $after)
      }
    `),
    { after }
  );
  if (errors || !data?.stayMostRecentTimestamp) return null;
  return data.stayMostRecentTimestamp;
}

export async function getCacheTimestamp() {
  const files = await s3.listFiles(BUCKET, PATH);
  if (!files?.data?.length) return null;

  const recent = files.data
    .map((s) => Number(s.path.replace(PATH, '').match(/^(\d+)\.ics$/)?.[1]))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => b - a);

  if (!recent.length) return null;

  return recent[0];
}

export async function retrieveCache(ts: number) {
  const data = await s3.getFile({
    bucket: BUCKET,
    path: PATH + `${ts}.ics`,
  });
  if (!data) return null;

  try {
    return new TextDecoder().decode(data);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateCache(createdTS: number, newFile: string) {
  const lastCache = await getCacheTimestamp();

  const success = await s3.uploadFile(
    {
      bucket: BUCKET,
      path: PATH + `${createdTS}.ics`,
    },
    { Body: newFile }
  );
  if (!success) {
    console.log('CACHE UPLOAD FAILED');
    return;
  }

  if (lastCache) {
    s3.deleteFile({
      bucket: BUCKET,
      path: PATH + `${lastCache}.ics`,
    }).catch(() => {});
  }
}
