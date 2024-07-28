import { IMAGE_TYPES } from './FILE_TYPES';
import { Buckets, checkFileType } from './s3';

// CONSTANTS
export const BUCKET = Buckets.RESOURCE_BUCKET;
export const PATH = 'images/';

// FUNCTIONS

export const checkImageType = (filename: string) =>
  checkFileType(filename, ...IMAGE_TYPES);
