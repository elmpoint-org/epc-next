const stage = process.env.NEXT_PUBLIC_STAGE;

export const SITE_DOMAIN_MAP = {
  development: 'http://localhost:3001',
  production: 'https://www.elmpoint.xyz',
  next: 'https://next.elmpoint.xyz',
} satisfies Record<string, string>;

export const CURRENT_SITE_DOMAIN =
  SITE_DOMAIN_MAP[stage as keyof typeof SITE_DOMAIN_MAP];

export const CURRENT_API_DOMAIN = process.env.NEXT_PUBLIC_SERVER_API_URL ?? '';
