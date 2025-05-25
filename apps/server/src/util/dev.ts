export const isDev = !!process.env.NEXT_PUBLIC_IS_DEV;

export const apiDomain = process.env.NEXT_PUBLIC_SERVER_API_URL ?? '';

export const siteDomain = isDev
  ? 'http://localhost:3001'
  : process.env.NEXT_PUBLIC_CLIENT_URL ?? '';
