export const ALLOW_UNAUTH_USERS = true;

export const DEFAULT_KEY_LENGTH = 32;
export const JWT_ALGORITHM = 'HS256';

// prettier-ignore
export const LOGIN_EXPIRE = (6) * 2629800 // (#) months
// prettier-ignore
export const EMAIL_LOGIN_EXPIRE = (6) * 3600 // (#) hours

// prettier-ignore
export const UPLOAD_PRESIGN_EXPIRE = (10) * 60; // (#) minutes
// prettier-ignore
export const FILE_GET_PRESIGN_EXPIRE = (48) * 3600 // (#) hours

/** the default number of files to show in the file manager */
export const DEFAULT_MAX_FILES_LIST_LIMIT = 100;
