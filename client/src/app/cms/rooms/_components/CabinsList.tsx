'use client';

import { graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import { Inside } from '@/util/inferTypes';
import { ResultOf } from '@graphql-typed-document-node/core';
import { ActionIcon, Collapse, Switch, TextInput } from '@mantine/core';
import { IconChevronDown, IconChevronLeft } from '@tabler/icons-react';

const CABINS_QUERY = graphql(`
  query Cabins {
    cabins {
      id
      name
      aliases
      rooms {
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
    }
  }
`);

type Cabin = Inside<ResultOf<typeof CABINS_QUERY>['cabins'] & {}>;
type Room = Inside<Cabin['rooms']> & {};

export default function CabinsList() {
  const query = useGraphQuery(CABINS_QUERY);

  const cabins = query.data?.cabins;

  return (
    <>
      <div className="flex flex-col gap-4">
        {cabins?.map((cabin) => (
          <div
            key={cabin.id}
            className="flex flex-col gap-2 rounded-lg border border-slate-300 p-4 shadow-sm"
          >
            <div className="flex flex-row items-center gap-2">
              <TextInput value={cabin.name} size="lg" className="flex-1" />

              <ActionIcon size="lg" color="slate" variant="subtle">
                <IconChevronLeft />
              </ActionIcon>
            </div>

            <Collapse in={false}>
              <div className="flex flex-col gap-2 p-4">
                <div className="border-b border-slate-300">aliases</div>
                <div className="hidden text-sm italic last:block">
                  no aliases
                </div>
                {cabin.aliases.map((alias, i) => (
                  <div key={i} className="">
                    <TextInput value={alias} />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 p-4">
                <div className="border-b border-slate-300">rooms</div>
                <div className="hidden text-sm italic last:block">no rooms</div>
                {cabin.rooms
                  .filter((r): r is Room => !!r)
                  .map((room, i) => (
                    <div
                      key={room.id}
                      className="flex flex-col gap-2 rounded-md border border-slate-300 p-4 shadow-sm"
                    >
                      <TextInput value={room.name} label="Room Name" />

                      <div className="flex flex-col gap-2 p-4">
                        <div className="border-b border-slate-300">aliases</div>
                        <div className="hidden text-sm italic last:block">
                          no aliases
                        </div>
                        {room.aliases.map((alias, i) => (
                          <div key={i} className="">
                            <TextInput value={alias} />
                          </div>
                        ))}
                      </div>

                      <div
                        className="group relative flex flex-col gap-4 rounded-[4px] border border-slate-300 p-3 px-4 data-[s]:border-transparent md:flex-row md:items-center md:gap-7"
                        // data-s={isSkeleton || null}
                      >
                        <p className="text-xs uppercase">options:</p>
                        {(
                          [
                            ['forCouples', 'For couples'],
                            ['noCount', 'Don’t count availability'],
                          ] as [string, string][]
                        ).map((it, i) => (
                          <Switch
                            key={i}
                            // checked={form[it[0]] as boolean}
                            // onChange={({ currentTarget: { checked: c } }) =>
                            //   updateForm({ [it[0]]: c })
                            // }
                            label={it[1] ?? it[0]}
                            classNames={{
                              input: 'peer',
                              track:
                                '[.peer:not(:checked)~&]:border-slate-300 [.peer:not(:checked)~&]:bg-slate-300',
                              thumb: 'border-0',
                              body: 'items-center',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </Collapse>
          </div>
        ))}
      </div>
    </>
  );
}
