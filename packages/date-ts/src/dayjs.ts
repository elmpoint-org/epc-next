import dayjsRoot from 'dayjs';

import utc from 'dayjs/plugin/utc';
dayjsRoot.extend(utc);

export const dayjs = dayjsRoot;
