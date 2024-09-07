'use client';

import { ResultOf } from '@graphql-typed-document-node/core';

import { IconDoor, IconHomePlus } from '@tabler/icons-react';

import { graphAuth, graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import { Inside } from '@/util/inferTypes';
import { UseQueryResult } from '@tanstack/react-query';

import RoomCabinPanel from './RoomCabinPanel';
import CardButton from '@/app/_components/_base/CardButton';
import { useCallback, useTransition } from 'react';
import { err } from '../_functions/errors';
import { ROOT_CABIN_ID } from '@@/db/schema/Room/CABIN_DATA';

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
  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const cabins = query.data?.cabins;
  const rootRooms = query.data?.roomsNoCabin;

  const props: CabinRoomProps = {
    query,
    refetch,
  };

  const [isLoadingNC, loadingNC] = useTransition();
  const newCabin = useCallback(() => {
    loadingNC(async () => {
      const { data, errors } = await graphAuth(
        graphql(`
          mutation CabinCreate($name: String!, $aliases: [String!]!) {
            cabinCreate(name: $name, aliases: $aliases) {
              id
            }
          }
        `),
        { name: '', aliases: [] },
      );
      if (errors || !data?.cabinCreate) return err(errors?.[0].code ?? errors);
      await refetch();
    });
  }, [refetch]);

  const [isLoadingNR, loadingNR] = useTransition();
  const newRootRoom = useCallback(() => {
    loadingNR(async () => {
      const { data, errors } = await graphAuth(
        graphql(`
          mutation RoomCreate(
            $name: String!
            $aliases: [String!]!
            $cabinId: String!
            $beds: Int!
          ) {
            roomCreate(
              name: $name
              aliases: $aliases
              cabinId: $cabinId
              beds: $beds
            ) {
              id
            }
          }
        `),
        { name: '', aliases: [], beds: 0, cabinId: ROOT_CABIN_ID },
      );
      if (errors || !data?.roomCreate) return err(errors?.[0].code ?? errors);

      await refetch();
    });
  }, [refetch]);

  return (
    <>
      <div className="flex-1 columns-1 gap-4 space-y-4 md:columns-2 md:py-4 2xl:columns-3">
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
              className="min-h-36 flex-1 rounded-sm rounded-t-lg"
              icon={IconHomePlus}
              onClick={newCabin}
              loading={isLoadingNC}
            >
              Add a cabin
            </CardButton>
            <CardButton
              className="min-h-36 flex-1 rounded-sm rounded-b-lg"
              icon={IconDoor}
              onClick={newRootRoom}
              loading={isLoadingNR}
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
                  height: `calc(20rem + ${i % 2 ? '' : '-'}${64 + i * 4}px)`,
                }}
              />
            ))}
      </div>
    </>
  );
}

export type CabinRoomProps = {
  query: UseQueryResult<ResultOf<typeof CABINS_QUERY>>;
  refetch: () => Promise<void>;
};
