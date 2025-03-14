import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import fdeq from 'fast-deep-equal';

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverGroup,
} from '@headlessui/react';
import {
  ActionIcon,
  Button,
  HoverCard,
  HoverCardDropdown,
  HoverCardTarget,
  NumberInput,
  ScrollArea,
  Tooltip,
} from '@mantine/core';
import { IconBed, IconChevronRight, IconRestore } from '@tabler/icons-react';

import { CMSCabin, CMSRoom, CabinRoomProps } from './CabinsList';
import { alphabetical } from '@/util/sort';
import { SharedValues } from '@/util/inferTypes';
import { clx } from '@/util/classConcat';
import { ANY_ROOM } from '@@/db/schema/Room/CABIN_DATA';
import { graphAuth, graphql } from '@/query/graphql';
import { confirmModal } from '@/app/_components/_base/modals';
import { err } from '../_functions/errors';

import RoomSwatch from '@/app/calendar/_components/RoomSwatch';
import A from '@/app/_components/_base/A';
import Details from './Details';
import NameInput from './NameInput';
import OptionSwitch from './OptionSwitch';
import PlusButton from './PlusButton';
import CopyID from './CopyID';

const NEW_RING_DELAY_MS = 6000;

// COMPONENT
export default function RoomCabinPanel<RC extends CMSCabin | CMSRoom>({
  cabinOrRoom: serverObject,
  ...props
}: {
  cabinOrRoom: RC;
} & CabinRoomProps) {
  const { refetch } = props;

  const [rc, setRc] = useState<RC & {}>(serverObject);

  const isCabin = 'rooms' in rc;

  const dom = useRef<HTMLDivElement | null>(null);

  // scroll on mount if component is new
  const [newRing, setNewRing] = useState(
    !serverObject.name.length &&
      ('rooms' in serverObject || !serverObject.cabin),
  );
  useEffect(() => {
    let tm: ReturnType<typeof setTimeout>;
    if (newRing) {
      dom.current?.scrollIntoView({ behavior: 'smooth' });
      tm = setTimeout(() => setNewRing(false), NEW_RING_DELAY_MS);
    }
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form update function
  /** common values of cabinOrRoom */
  type RCCommon = SharedValues<CMSCabin, CMSRoom>;
  type FormUpdateType = <T = RCCommon>(
    updates: Partial<T> | ((c: T) => Partial<T>),
  ) => void;
  /** pass a type to specify the case-based type of RC. */
  const updateForm = useCallback<FormUpdateType>(
    (updates) =>
      setRc((c) => ({
        ...c,
        ...(typeof updates === 'function' ? updates(c as any) : updates),
      })),
    [],
  );

  const [isLoading, loading] = useTransition();
  const state = useMemo<'SAVED' | 'UNSAVED' | 'LOADING'>(() => {
    if (isLoading) return 'LOADING';
    if (!fdeq(rc, serverObject)) return 'UNSAVED';
    return 'SAVED';
  }, [isLoading, rc, serverObject]);

  useEffect(() => {
    if (serverObject && !fdeq(serverObject, rc)) setRc(serverObject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverObject]);

  // update cabin
  const handleSubmit = useCallback(() => {
    loading(async () => {
      if (!rc) return;
      if (!rc.name.length) return err('MISSING_NAME');

      if (isCabin) {
        // cabin update
        const { data, errors } = await graphAuth(
          graphql(`
            mutation CabinUpdate($id: ID!, $name: String, $aliases: [String!]) {
              cabinUpdate(id: $id, name: $name, aliases: $aliases) {
                id
              }
            }
          `),
          {
            id: rc.id,
            name: rc.name,
            aliases: rc.aliases,
          },
        );
        if (errors || !data?.cabinUpdate)
          return err(errors?.[0].code ?? errors);
      } else {
        // room update
        const { data, errors } = await graphAuth(
          graphql(`
            mutation RoomUpdate(
              $id: ID!
              $name: String
              $aliases: [String!]
              $beds: Int
              $forCouples: Boolean
              $noCount: Boolean
            ) {
              roomUpdate(
                id: $id
                name: $name
                aliases: $aliases
                beds: $beds
                forCouples: $forCouples
                noCount: $noCount
              ) {
                id
              }
            }
          `),
          {
            id: rc.id,
            name: rc.name,
            aliases: rc.aliases,
            beds: rc.beds,
            forCouples: rc.forCouples,
            noCount: rc.noCount,
          },
        );
        if (errors || !data?.roomUpdate) return err(errors?.[0].code ?? errors);
      }

      await refetch();
    });
  }, [isCabin, rc, refetch]);

  // new room
  const [isLoadingNR, loadingNR] = useTransition();
  const newRoom = useCallback(() => {
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
        { name: '', aliases: [], beds: 0, cabinId: rc.id },
      );
      if (errors || !data?.roomCreate) return err(errors?.[0].code ?? errors);

      await refetch();
    });
  }, [rc.id, refetch]);

  // delete cabin
  const handleDelete = useCallback(async () => {
    const yes = await confirmDeleteModal(isCabin);
    if (!yes) return;
    if (!confirm('Are you really sure?')) return;

    loading(async () => {
      if (!rc) return;

      if (isCabin) {
        // cabin delete
        const { data, errors } = await graphAuth(
          graphql(`
            mutation CabinDelete($id: ID!) {
              cabinDelete(id: $id) {
                id
              }
            }
          `),
          { id: rc.id },
        );
        if (errors || !data?.cabinDelete)
          return err(errors?.[0].code ?? errors);
      } else {
        // room delete
        const { data, errors } = await graphAuth(
          graphql(`
            mutation RoomDelete($id: ID!) {
              roomDelete(id: $id) {
                id
              }
            }
          `),
          { id: rc.id },
        );
        if (errors || !data?.roomDelete) return err(errors?.[0].code ?? errors);
      }

      await refetch();
    });
  }, [isCabin, rc, refetch]);

  return (
    <>
      <form
        className="break-inside-avoid"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit();
        }}
      >
        <div
          className={clx(
            'relative flex h-full max-w-[32rem] flex-col gap-2 rounded-md border border-slate-300 bg-dwhite p-6 shadow-sm',
            /* new ring */ 'ring-transparent ring-offset-2 transition data-[r]:ring-4 data-[r]:ring-emerald-600',
          )}
          data-r={newRing || null}
        >
          {/* scroll target */}
          <div className="absolute inset-x-0 top-0" ref={dom} />

          {/* title bar */}
          <div className="flex flex-row items-center justify-between">
            {/* cabin name */}
            <div className="flex flex-row items-center gap-2">
              {/* swatch */}
              <HoverCard withArrow>
                <HoverCardTarget>
                  <div className="-m-2 p-2">
                    <RoomSwatch cabinOrRoomId={serverObject.id} withDefault />
                  </div>
                </HoverCardTarget>
                <HoverCardDropdown
                  classNames={{
                    dropdown: 'rounded-lg border border-slate-300 shadow-sm',
                    arrow: 'border border-slate-300',
                  }}
                >
                  <p>
                    <span>Calendar colors must be changed </span>
                    <A
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://github.com/elmpoint-org/epc-next/blob/main/client/src/app/calendar/_util/cabinColors.ts#L3"
                    >
                      directly on GitHub
                    </A>
                    .
                  </p>
                </HoverCardDropdown>
              </HoverCard>
              {/* text */}
              <h3 className="text-lg">
                {serverObject.name || (isCabin ? 'New Cabin' : 'New Room')}
              </h3>
            </div>

            {/* form action buttons */}
            <div className="flex flex-row items-center gap-2">
              <Tooltip label="Reset to saved">
                <ActionIcon
                  aria-label="reset to saved"
                  variant="subtle"
                  className="data-[disabled]:invisible"
                  disabled={state !== 'UNSAVED'}
                  onClick={() => updateForm(serverObject)}
                >
                  <IconRestore className="h-5" />
                </ActionIcon>
              </Tooltip>
              <Button
                type="submit"
                size="compact-md"
                disabled={state !== 'UNSAVED'}
                loading={state === 'LOADING'}
              >
                Save
              </Button>
            </div>
          </div>

          {/* cabin details */}
          <div className="flex flex-col gap-4 py-2">
            {/* name */}
            <NameInput
              label={isCabin ? 'Cabin Name' : 'Room Name'}
              placeholder="Enter a name"
              value={rc.name}
              onUpdate={(nv) => updateForm({ name: nv })}
              onDelete={handleDelete}
            />

            {/* ANY room warning */}
            {!isCabin && serverObject.name === ANY_ROOM && (
              <div className="max-w-[24rem] rounded-md border border-amber-600/90 bg-amber-300/30 p-4 text-sm text-amber-900">
                Rooms marked “{ANY_ROOM}” have special instructions in the
                calendar system, which won’t work if you change this name.
              </div>
            )}

            {/* nicknames (aliases) */}
            <Details summary={<>Nicknames ({rc.aliases.length})</>} open>
              {rc.aliases.map((name, i) => (
                <NameInput
                  key={i}
                  value={name}
                  aria-label="alias name"
                  placeholder="Nickname"
                  onUpdate={(nv) =>
                    updateForm({ aliases: rc.aliases.with(i, nv) })
                  }
                  onDelete={() =>
                    updateForm(({ aliases: a }) => {
                      const aliases = [...a];
                      aliases.splice(i, 1);
                      return { aliases };
                    })
                  }
                />
              ))}

              <PlusButton
                onClick={() =>
                  updateForm(({ aliases: a }) => {
                    const aliases = [...a];
                    aliases.push('');
                    return { aliases };
                  })
                }
              >
                Add nickname
              </PlusButton>
            </Details>

            {!isCabin && (
              <Details summary={<>Options</>} open>
                <div className="-mx-2 flex flex-col gap-4 rounded-lg border border-slate-300 p-4">
                  <OptionSwitch
                    label="Suitable for couples"
                    checked={rc.forCouples ?? false}
                    onChange={({ currentTarget: { checked: c } }) =>
                      updateForm<CMSRoom>({ forCouples: c })
                    }
                  />
                  <OptionSwitch
                    label="Track room availability"
                    checked={!(rc.noCount ?? false)}
                    onChange={({ currentTarget: { checked: c } }) =>
                      updateForm<CMSRoom>({ noCount: !c })
                    }
                  />

                  <NumberInput
                    label="Number of beds"
                    value={rc.beds}
                    onChange={(s) => {
                      let n: number;
                      if (typeof s === 'number') n = s;
                      else n = parseInt(s);
                      updateForm<CMSRoom>({ beds: Number.isFinite(n) ? n : 0 });
                    }}
                    min={0}
                    max={99}
                    size="sm"
                    classNames={{
                      root: 'flex flex-row-reverse items-center justify-end gap-3',
                      input: 'w-16 pr-8 text-center',
                    }}
                  />
                </div>
              </Details>
            )}

            {/* rooms */}
            {isCabin && (
              <Details summary={<>Rooms</>} open>
                <PopoverGroup className="flex flex-col gap-2">
                  {'rooms' in serverObject &&
                    serverObject.rooms
                      .filter((r): r is CMSRoom => !!r)
                      .sort(alphabetical((c) => c.name))
                      .map((room) => (
                        <Popover key={room.id} className="flex flex-col">
                          <PopoverButton className="group flex flex-row items-center gap-4 rounded-md border border-slate-300 px-4 py-2 text-left text-sm hover:border-slate-600 focus:outline-emerald-700">
                            <IconBed
                              className="size-6 text-slate-400"
                              stroke={1.5}
                            />
                            <div className="flex-1">{room.name}</div>
                            <IconChevronRight className="size-4 text-slate-400 group-hover:text-slate-600" />
                          </PopoverButton>

                          <PopoverPanel
                            anchor={{
                              to: 'bottom',
                              gap: '0.75rem',
                              padding: '1rem',
                            }}
                            transition
                            className={clx(
                              'z-[199] flex min-w-[20rem] flex-col !overflow-hidden rounded-md shadow-lg sm:min-w-[24rem]',
                              /* transition */ 'translate-y-0 transition data-[closed]:-translate-y-2 data-[closed]:opacity-0',
                            )}
                          >
                            <ScrollArea
                              classNames={{
                                root: 'flex flex-col',
                                scrollbar: 'm-0.5',
                              }}
                            >
                              <div className="t">
                                <RoomCabinPanel cabinOrRoom={room} {...props} />
                              </div>
                            </ScrollArea>
                          </PopoverPanel>
                        </Popover>
                      ))}

                  <PlusButton loading={isLoadingNR} onClick={newRoom}>
                    Add a room
                  </PlusButton>
                </PopoverGroup>
              </Details>
            )}
          </div>
          <CopyID id={rc.id} />
        </div>
      </form>
    </>
  );
}

function confirmDeleteModal(isCabin: boolean) {
  return confirmModal({
    color: 'red',
    title: `Delete ${isCabin ? 'Cabin' : 'Room'}?`,
    body: (
      <>
        <p>
          Are you certain you want to <b>permanently delete</b> this entire{' '}
          {!isCabin ? 'room' : 'cabin and all rooms inside it'}?
        </p>

        <p>
          <span className="text-red-800">
            Any calendar reservations that reference this{' '}
            {isCabin ? 'cabin' : 'room'} will be removed.
          </span>{' '}
          (The events will remain, but their inner reservations may be lost
          forever.)
        </p>
      </>
    ),
  });
}

// -------------------------------------------
