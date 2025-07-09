import type { ViewType } from './app/calendar/_util/queryStates';

/** standard number of times to retry a query before failing */
export const GLOBAL_RETRIES = 3;

/** default number of days before logins expire */
export const AUTH_EXPIRES_AFTER_DAYS = 30;

// CALENDAR

// the min/max amount of days to show at once
export const CALENDAR_DAYS_MIN = 1;
export const CALENDAR_DAYS_MAX = 14;

// the default number of days to show on smaller and larger screens
export const CALENDAR_DEFAULT_DAYS_DESKTOP = 7;
export const CALENDAR_DEFAULT_DAYS_MOBILE = 4;

// the default view to show in the calendar
export const CALENDAR_DEFAULT_VIEW: ViewType = 'OVERVIEW';
export const CALENDAR_DEFAULT_VIEW_MOBILE: ViewType = 'AGENDA';

// the number of weeks to show in month view(s)
export const OVERVIEW_NUM_WEEKS = 6;
