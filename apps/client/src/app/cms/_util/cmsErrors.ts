import { prettyError } from '@/util/prettyErrors';

export const cmsErrorMap = prettyError(
  {
    __DEFAULT: 'Unknown error.',

    PAGE_NOT_FOUND: `That page wasn't found.`,
    EMPTY_SLUG: `The permalink cannot be empty.`,
    SLUG_IN_USE: `A different page is already using that permalink.`,
    INVALID_CONTRIBUTOR: `Error finding contributor.`,
  },
  (s) => s,
);
