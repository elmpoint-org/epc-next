export const isDev = process.env.NODE_ENV === 'development';

export const isUsingPublicApi = !!process.env.NEXT_PUBLIC_USE_PUBLIC_API;

export const api =
  isDev && !isUsingPublicApi
    ? 'http://localhost:3000'
    : 'https://api.elmpoint.xyz/one';
