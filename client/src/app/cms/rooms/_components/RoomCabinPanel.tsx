import {
  useCallback,
  useEffect,
  useMemo,
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
  CloseButton,
  HoverCard,
  HoverCardDropdown,
  HoverCardTarget,
  NumberInput,
  ScrollArea,
  Switch,
  SwitchProps,
  TextInput,
  Tooltip,
} from '@mantine/core';
import {
  IconBed,
  IconChevronRight,
  IconPlus,
  IconRestore,
} from '@tabler/icons-react';

import { CMSCabin, CMSRoom, CabinRoomProps } from './CabinsList';
import { alphabetical } from '@/util/sort';
import { SharedValues } from '@/util/inferTypes';
import { clx } from '@/util/classConcat';
import { ANY_ROOM } from '@@/db/schema/Room/CABIN_DATA';
import { SetState } from '@/util/stateType';

import RoomSwatch from '@/app/calendar/_components/RoomSwatch';
import A from '@/app/_components/_base/A';
import Details from './Details';
import { graphAuth, graphql } from '@/query/graphql';
import { notifications } from '@mantine/notifications';
import { prettyError } from '@/util/prettyErrors';

// COMPONENT
export default function RoomCabinPanel<
  RC extends CMSCabin | CMSRoom = CMSCabin,
>({
  cabinOrRoom: serverObject,
  ...props
}: { cabinOrRoom: RC } & CabinRoomProps) {
  const { refetch, query } = props;

  const [rc, setRc] = useState(serverObject);

  const isCabin = 'rooms' in rc;

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
    if (isLoading || query.isFetching) return 'LOADING';
    if (!fdeq(rc, serverObject)) return 'UNSAVED';
    return 'SAVED';
  }, [isLoading, query.isFetching, rc, serverObject]);

  useEffect(() => {
    if (!fdeq(serverObject, rc)) setRc(serverObject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverObject]);

  // update cabin
  const handleSubmit = useCallback(() => {
    loading(async () => {
      if (!rc) return;

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

      refetch();
    });

    function err(message: unknown, log?: unknown) {
      console.log(message);
      notifications.show({
        color: 'red',
        message: prettyError(
          {
            __DEFAULT: 'An error occurred.',
          },
          (s) => `Unknown error: ${s}`,
        )(message),
      });
    }
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
        <div className="flex h-full max-w-[32rem] flex-col gap-2 rounded-md border border-slate-300 bg-dwhite p-6 shadow-sm">
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
              <h3 className="text-lg">{serverObject.name || 'Cabin'}</h3>
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
            <TextInput
              label="Cabin Name"
              placeholder="Cabin's name"
              value={rc.name}
              onChange={({ currentTarget: { value: v } }) =>
                updateForm({ name: v })
              }
            />

            {/* ANY room warning */}
            {!isCabin && rc.name === ANY_ROOM && (
              <div className="max-w-[24rem] rounded-md border border-amber-600/90 bg-amber-300/30 p-4 text-sm text-amber-900">
                Rooms marked “{ANY_ROOM}” have special instructions in the
                calendar system, which won’t work if you change this name.
              </div>
            )}

            {/* nicknames (aliases) */}
            <Details
              summary={<>Nicknames ({rc.aliases.length})</>}
              // open={isCabin}
            >
              {rc.aliases.map((name, i) => (
                <TextInput
                  key={i}
                  value={name}
                  aria-label="alias name"
                  placeholder="Nickname"
                  onChange={({ currentTarget: { value: v } }) =>
                    updateForm({ aliases: rc.aliases.with(i, v) })
                  }
                  rightSection={
                    <CloseButton
                      onClick={() => {
                        if (name.length)
                          updateForm({ aliases: rc.aliases.with(i, '') });
                        else
                          updateForm(({ aliases: a }) => {
                            const aliases = [...a];
                            aliases.splice(i, 1);
                            return { aliases };
                          });
                      }}
                    />
                  }
                />
              ))}

              <Button
                size="compact"
                justify="center"
                variant="light"
                leftSection={<IconPlus className="size-4" />}
                onClick={() =>
                  updateForm(({ aliases: a }) => {
                    const aliases = [...a];
                    aliases.push('');
                    return { aliases };
                  })
                }
              >
                Add nickname
              </Button>
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
            {'rooms' in serverObject && (
              <Details summary={<>Rooms</>} open>
                <PopoverGroup className="flex flex-col gap-2">
                  {serverObject.rooms
                    .filter((r): r is CMSRoom => !!r)
                    .sort(alphabetical((c) => c.name))
                    .map((room) => (
                      <Popover key={room.id} className="flex flex-col">
                        <PopoverButton className="group flex flex-row items-center gap-4 rounded-md border border-slate-300 px-4 py-2 text-left text-sm hover:border-slate-600">
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
                </PopoverGroup>
              </Details>
            )}
          </div>
        </div>
      </form>
    </>
  );
}

function OptionSwitch({ ...props }: SwitchProps) {
  return (
    <>
      <Switch
        {...props}
        classNames={{
          input: 'peer',
          track:
            '[.peer:not(:checked)~&]:border-slate-300 [.peer:not(:checked)~&]:bg-slate-300',
          thumb: 'border-0',
          body: 'items-center',
        }}
      />
    </>
  );
}

function useObjectUpdate<T>() {
  function useHook<K extends T>(setStateFunction: SetState<K>) {
    return useCallback(
      (updates: Partial<T> | ((c: T) => Partial<T>)) =>
        setStateFunction((c) => ({
          ...c,
          ...(typeof updates === 'function' ? updates(c) : updates),
        })),
      [setStateFunction],
    );
  }
  return useHook;
}
