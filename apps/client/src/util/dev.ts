import { CURRENT_API_DOMAIN, CURRENT_SITE_DOMAIN } from '@epc/types/urls';

export const isDev = !!process.env.NEXT_PUBLIC_IS_DEV;

export const isUsingPublicApi = !!process.env.NEXT_PUBLIC_USE_PUBLIC_API;

export const api = isUsingPublicApi
  ? 'https://api.elmpoint.xyz'
  : CURRENT_API_DOMAIN;

export const siteDomain = CURRENT_SITE_DOMAIN;
