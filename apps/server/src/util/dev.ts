import { CURRENT_API_DOMAIN, CURRENT_SITE_DOMAIN } from '@epc/types/urls';

export const isDev =
  !!process.env.NEXT_PUBLIC_IS_DEV && process.env.NEXT_PUBLIC_STAGE !== 'next';

export const apiDomain = CURRENT_API_DOMAIN;

export const siteDomain = CURRENT_SITE_DOMAIN;
