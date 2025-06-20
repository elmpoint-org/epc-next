import type { UserNotifSettings } from '@epc/server/graphql-types';

export type NotifTypes = keyof Omit<UserNotifSettings, '__typename'>;

/** if a user's notification option is unset, this is its default value. */
export const NOTIF_DEFAULT_VALUES: Record<NotifTypes, boolean> = {
  UNSUBSCRIBED: false,
  calendarStayReminder: true,
};
