import { graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import { useFormCtx } from './formCtx';
import { dateTS } from '../../_util/dateUtils';
import { Inside } from '@/util/inferTypes';
import { ResultOf } from '@graphql-typed-document-node/core';
import { keepPreviousData } from '@tanstack/react-query';

// QUERIES

export const CABIN_FRAGMENT = graphql(`
  fragment StayCabinData on Cabin @_unmask {
    id
    name
    aliases
  }
`);
export const ROOM_FRAGMENT = graphql(
  `
    fragment StayRoomData on Room @_unmask {
      id
      cabin {
        ...StayCabinData
      }
      name
      aliases
      beds
      availableBeds(start: $start, end: $end)
      forCouples
      noCount
    }
  `,
  [CABIN_FRAGMENT],
);

export const QUERY_ROOM_OPTIONS = graphql(
  `
    query InitialRoomOptions($start: Int, $end: Int) {
      cabins {
        ...StayCabinData
      }
      rooms {
        ...StayRoomData
      }
    }
  `,
  [CABIN_FRAGMENT, ROOM_FRAGMENT],
);

// TYPES

export type Cabin = Inside<ResultOf<typeof QUERY_ROOM_OPTIONS>['cabins']> & {
  useAlias?: number;
};
export type Room = Inside<ResultOf<typeof QUERY_ROOM_OPTIONS>['rooms']> & {
  useAlias?: number;
};

// HOOKS

/** getrooms uses the form context provider to get dates. */
export function useGetRooms() {
  // get dates range for availability
  const { dates } = useFormCtx();
  const start = dates[0] && dateTS(dates[0]);
  const end = dates[1] && dateTS(dates[1]);

  // run query
  const query = useGraphQuery(
    QUERY_ROOM_OPTIONS,
    { start, end },
    {
      placeholderData: keepPreviousData,
    },
  );

  // filter to non-null data
  const cabins = alphabetical(
    (query.data?.cabins ?? []).filter((it): it is Cabin => it !== null),
  );

  const rooms = alphabetical(
    (query.data?.rooms ?? []).filter((it): it is Room => it !== null),
  );

  const initialOptions: (Cabin | Room)[] = [
    ...cabins,
    ...rooms.filter((it) => it.cabin === null),
  ];
  return { initialOptions, rooms, cabins, query };
}

type SortInput = { name: string; [key: string]: unknown };
function alphabetical<T extends SortInput[]>(arr: T) {
  return arr.sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
  });
}
