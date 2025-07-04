import type { UserNotifSettings } from '../../../apps/server/src/db/__types/graphql-types';

export type NotifTypes = keyof Omit<UserNotifSettings, '__typename'>;

/** if a user's notification option is unset, this is its default value. */
export const NOTIF_DEFAULT_VALUES: Record<NotifTypes, boolean> = {
  UNSUBSCRIBED: false,
  calendarStayReminder: true,
};
