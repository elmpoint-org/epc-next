import type { UserCooldownUpdateOpts } from './_gql';

export type UserCooldownType = keyof UserCooldownUpdateOpts;

/** cooldowns in SECONDS for all stored cooldown params. */
export const COOLDOWN_TIMES = {
  nextLoginEmail: 5 * 60,
} satisfies Record<UserCooldownType, number>;
