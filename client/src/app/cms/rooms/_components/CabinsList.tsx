'use client';

import { ResultOf } from '@graphql-typed-document-node/core';

import { IconDoor, IconHomePlus } from '@tabler/icons-react';

import { graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import { Inside } from '@/util/inferTypes';
import { UseQueryResult } from '@tanstack/react-query';

import RoomCabinPanel from './RoomCabinPanel';
import CardButton from '@/app/_components/_base/CardButton';

const ROOM_FRAGMENT = graphql(`
  fragment RoomData on Room @_unmask {
    id
    name
    aliases
    cabin {
      id
      name
    }
    beds
    forCouples
    noCount
  }
`);
const CABINS_QUERY = graphql(
  `
    query Cabins {
      cabins {
        id
        name
        aliases
        rooms {
          ...RoomData
        }
      }
      roomsNoCabin {
        ...RoomData
      }
    }
  `,
  [ROOM_FRAGMENT],
);

export type CMSCabin = Inside<ResultOf<typeof CABINS_QUERY>['cabins'] & {}>;
export type CMSRoom = Inside<CMSCabin['rooms']> & {};

export default function CabinsList() {
  const query = useGraphQuery(CABINS_QUERY);
  function refetch() {
    query.refetch();
  }

  const cabins = query.data?.cabins;
  const rootRooms = query.data?.roomsNoCabin;

  const props: CabinRoomProps = {
    query,
    refetch,
  };

  return (
    <>
      <div className="flex-1 columns-1 gap-4 space-y-4 md:columns-2 md:py-4">
        {/* cabins */}
        {cabins?.map((cabin) => (
          <RoomCabinPanel key={cabin.id} cabinOrRoom={cabin} {...props} />
        ))}
        {/* root rooms */}
        {rootRooms?.map((room) => (
          <RoomCabinPanel key={room.id} cabinOrRoom={room} {...props} />
        ))}
        {/* new room buttons */}
        {cabins && (
          <div className="flex h-full break-inside-avoid flex-col gap-2">
            <CardButton
              className="flex-1 rounded-sm rounded-t-lg"
              icon={IconHomePlus}
            >
              Add a cabin
            </CardButton>
            <CardButton
              className="flex-1 rounded-sm rounded-b-lg"
              icon={IconDoor}
            >
              Add a root room
            </CardButton>
          </div>
        )}

        {/* SKELETON */}
        {query.isLoading &&
          Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse break-inside-avoid rounded-md bg-slate-200 shadow-sm"
                style={{
                  height: `calc(16rem + ${i % 2 ? '' : '-'}${16 + i * 4}px)`,
                }}
              />
            ))}
      </div>
    </>
  );
}

export type CabinRoomProps = {
  query: UseQueryResult<ResultOf<typeof CABINS_QUERY>>;
  refetch: () => void;
};
