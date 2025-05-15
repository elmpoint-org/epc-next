import { prettyError } from '@/util/prettyErrors';
import { notifications } from '@mantine/notifications';

export function err(message: unknown, log?: unknown) {
  console.log(message);
  notifications.show({
    color: 'red',
    message: prettyError(
      {
        __DEFAULT: 'An error occurred.',
        MISSING_NAME: 'You must enter a name.',
      },
      (s) => `Unknown error: ${s}`,
    )(message),
  });
}
