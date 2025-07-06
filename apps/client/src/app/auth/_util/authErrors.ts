import { prettyError } from '@/util/prettyErrors';
import { COOLDOWN_TIMES } from '@epc/gql-consts/cooldown';

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
    COOLDOWN_VIOLATION: `You can only send one login email every ${COOLDOWN_TIMES['nextLoginEmail'] / 60} minutes. Wait a few minutes and try again. If you don’t see the email, check your spam folder.`,
  },
  (s) => `Unknown error message: ${s}`,
);
