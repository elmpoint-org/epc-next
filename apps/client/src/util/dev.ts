export const isDev = !!process.env.NEXT_PUBLIC_IS_DEV;

export const isUsingPublicApi = !!process.env.NEXT_PUBLIC_USE_PUBLIC_API;

export const api = !isUsingPublicApi
  ? process.env.NEXT_PUBLIC_SERVER_API_URL
  : 'the_permanent_server_address'; //TODO fix this once we do sst domain assignment

export const siteDomain = isDev
  ? 'http://localhost:3001'
  : 'https://one.elmpoint.xyz';
