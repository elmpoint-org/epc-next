export enum Senders {
  DEFAULT = 'Elm Point <noreply@elmpoint.xyz>',
  AUTH = 'Elm Point <authentication@elmpoint.xyz>',
}

export const BrevoSenders = {
  __DEFAULT: {
    name: 'Elm Point',
    email: 'noreply@elmpoint.xyz',
  },
  AUTH: { name: 'Elm Point', email: 'auth@elmpoint.xyz' },
  NOTIFICATION: { name: 'Elm Point', email: 'notifications@elmpoint.xyz' },
} satisfies Record<string, BrevoSender>;
export type BrevoSenderOpts = keyof typeof BrevoSenders;
export type BrevoSender = { name: string; email: string };
