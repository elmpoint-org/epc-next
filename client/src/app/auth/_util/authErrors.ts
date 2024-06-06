import { prettyError } from '@/util/prettyErrors';

export const authErrorMap = prettyError({
  __DEFAULT: 'Something went wrong.',
  AUTHORIZATION_FAILED: `That passkey isn’t valid.`,
  USER_NOT_FOUND: `That user doesn’t exist.`,
  MAGIC_LINK_FAILED: `The link couldn’t be sent.`,

  // registration errors...
  USER_ALREADY_EXISTS: `A user already exists with that email.`,
});
