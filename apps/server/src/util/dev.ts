export const isDev = !!process.env.IS_OFFLINE;

export const apiDomain = isDev
  ? 'http://localhost:3000'
  : 'https://api.elmpoint.xyz/one';

export const siteDomain = isDev
  ? 'http://localhost:3001'
  : 'https://one.elmpoint.xyz';
