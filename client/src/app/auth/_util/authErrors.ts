import { prettyError } from '@/util/prettyErrors';

export const authErrorMap = prettyError(
  {
    __DEFAULT: 'Something went wrong.',

    AUTHORIZATION_FAILED: `That passkey isn’t valid.`,
    USER_NOT_FOUND: `That user doesn’t exist.`,
    MAGIC_LINK_FAILED: `The link couldn’t be sent.`,
    NEED_PERMISSION: `You don’t have the necessary permissions for that action.`,

    // registration errors...
    USER_ALREADY_EXISTS: `A user already exists with that email.`,
    NEEDS_REFERRAL: `That email wasn’t recognized. Please use an email that has either received an invitation or is on the Elm Point mailing list.`,
  },
  (s) => `Unknown error message: ${s}`,
);
