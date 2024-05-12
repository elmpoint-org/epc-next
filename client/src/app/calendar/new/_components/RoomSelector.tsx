import { useEffect, useMemo, useState } from 'react';

import {
  Anchor,
  CloseButton,
  Combobox,
  Pill,
  PillsInput,
  Tooltip,
  useCombobox,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

import RoomOption from './RoomOption';

import { cabins, rooms, CUSTOM_ROOM_ID } from '@/sampleRoomData';
import { Cabin, Room, useFormCtxRoomState } from '../state/formCtx';

const SEPARATOR = `/`;

const initialOptions = [...cabins, ...rooms.filter((it) => it.cabin === null)];

// COMPONENT
const RoomSelector = ({
  rowIndex,
  className,
}: {
  rowIndex: number;
  className: string;
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const {
    selectedCabin,
    selectedRoom,
    updateRoomData,
    setSelectedCabin,
    setSelectedRoom,
  } = useFormCtxRoomState(rowIndex);

  const initialize = () => {
    setSearch('');
    updateRoomData({ room: null, cabin: null });
  };

  const handleSelect = (id: string | 'CUSTOM') => {
    const inputBuffer = search;
    setSearch('');

    // handle custom case
    if (id === 'CUSTOM') {
      updateRoomData({
        cabin: null,
        room: {
          id: CUSTOM_ROOM_ID,
          name: inputBuffer,
          cabin: null,
          aliases: [],
          beds: 0,
          availableBeds: 0,
        },
      });
      combobox.closeDropdown();
      return;
    }

    const cabin = cabins.find((it) => it.id === id);
    if (cabin) {
      updateRoomData({
        room: null,
        cabin,
      });
      return;
    }
    const room = rooms.find((it) => it.id === id);
    if (room) {
      setSelectedRoom(room);
      if (room.cabin?.id && room.cabin.id !== selectedCabin?.id)
        setSelectedCabin(cabins.find((it) => it.id === room.cabin?.id) ?? null);
      combobox.closeDropdown();
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => combobox.updateSelectedOptionIndex(), [selectedCabin]);

  // handle search
  const [search, setSearch] = useState('');
  const runTermSearch = (terms: string[], candidate: string) =>
    terms.reduce(
      (count, term) =>
        candidate.toLowerCase().includes(term) ? count + 1 : count,
      0,
    );
  const isIncomplete = useMemo(
    () => search.length || (selectedCabin && !selectedRoom),
    [search, selectedCabin, selectedRoom],
  );
  const searchResults = useMemo(() => {
    let terms = search.toLowerCase().match(/\S+/g);
    if (!terms) return [];
    let a: (Cabin | Room)[] = [
      ...rooms.map((it) => {
        const c = cabins.find(({ id }) => id === it.cabin?.id);
        if (!c) return it;
        return {
          ...it,
          name: `${c.name} ${SEPARATOR} ${it.name}`,
          cabin: { ...it.cabin, name: c.name },
        };
      }),
    ];
    if (selectedCabin)
      a = a.filter((it) => (it as Room).cabin?.id === selectedCabin.id);
    else a.unshift(...cabins);

    // do the search
    return a
      .map((it) => {
        let nt = terms as string[];
        let test = (t: string, s: string) => s.toLowerCase().includes(t);

        if ('beds' in it) {
          nt = nt.filter((t) => !test(t, it.cabin?.name || ''));
        }

        // try to match with item name
        if (!nt.filter((t) => !test(t, it.name)).length) return it;

        // otherwise try the aliases
        for (const aa of it.aliases) {
          if (!nt.filter((t) => !test(t, aa)).length) {
            const rr = it as Room;
            const n = rr.cabin ? `${rr.cabin.name} ${SEPARATOR} ${aa}` : aa;
            return { ...it, useAlias: n };
          }
        }

        return null;
      })
      .filter((it) => it !== null) as (Cabin | Room)[];
  }, [search, selectedCabin]);

  return (
    <>
      <Combobox store={combobox} onOptionSubmit={handleSelect}>
        <Combobox.DropdownTarget>
          <PillsInput
            label="Room"
            className={`peer ${className}`}
            classNames={{
              input: 'space-x-2 flex flex-row items-center h-10',
            }}
            data-incomplete={isIncomplete ? true : null}
            rightSection={
              (search || selectedCabin || selectedRoom) && (
                <CloseButton
                  size="sm"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    initialize();
                    combobox.openDropdown();
                  }}
                />
              )
            }
          >
            {/* selected option */}
            {selectedCabin && (
              <>
                <Pill
                  size="md"
                  className="p-0 first:pl-1"
                  classNames={{
                    label: '-mx-2.5 -mr-5 rounded-md bg-slate-200 px-2.5 pr-5',
                  }}
                >
                  <div className="">{selectedCabin.name}</div>
                </Pill>
                <span className="opacity-50">{SEPARATOR}</span>
              </>
            )}
            {selectedRoom && (
              <>
                <Pill
                  size="md"
                  className="group -mr-2 p-0 first:pl-1 data-[custom]:italic"
                  classNames={{
                    label:
                      '-mx-2.5 rounded-md bg-slate-200 px-2.5 group-data-[custom]:mr-2',
                  }}
                  data-custom={selectedRoom.id === CUSTOM_ROOM_ID ? true : null}
                >
                  <div className="">{selectedRoom.name}</div>
                </Pill>
              </>
            )}

            {/* search bar */}
            <Combobox.EventsTarget>
              <PillsInput.Field
                placeholder={!selectedRoom ? 'Search for a room' : ''}
                className="data-[nw]:w-0 data-[nw]:min-w-0"
                data-nw={selectedRoom ? true : null}
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={!selectedRoom ? search : ''}
                onChange={({ currentTarget: { value } }) => {
                  if (selectedRoom) return;
                  combobox.updateSelectedOptionIndex();
                  setSearch(value);
                  if (value.length) combobox.openDropdown();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && search.length === 0) {
                    e.preventDefault();
                    if (selectedRoom) {
                      if (selectedRoom.id === CUSTOM_ROOM_ID)
                        setSearch(selectedRoom.name);
                      return setSelectedRoom(null);
                    }
                    setSelectedCabin(null);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </PillsInput>
        </Combobox.DropdownTarget>
        {/* unfinished warning */}
        {isIncomplete && (
          <Tooltip
            label="Finish selecting a room option or changes may be lost."
            withArrow
            className="bg-amber-600"
          >
            <IconAlertTriangle
              size="16"
              className="absolute -top-4 right-0 text-amber-500 peer-has-[:focus]:hidden"
            />
          </Tooltip>
        )}

        {/* dropdown menu */}
        <Combobox.Dropdown
          classNames={{
            dropdown: 'border-slate-400',
          }}
        >
          <Combobox.Options className="relative">
            {/* search results */}
            {search.trim().length ? (
              <>
                {searchResults.map((it, i) => (
                  <RoomOption key={i} item={it} active={false} />
                ))}
                {!selectedCabin ? (
                  <Combobox.Option value="CUSTOM" className="">
                    <div className="flex flex-row items-center gap-2">
                      <div className="truncate">{search}</div>
                      <Pill
                        size="xs"
                        className="border border-sky-600 uppercase text-sky-600"
                      >
                        custom
                      </Pill>
                    </div>
                  </Combobox.Option>
                ) : (
                  !searchResults.length && (
                    <Combobox.Empty>No results found</Combobox.Empty>
                  )
                )}
              </>
            ) : (
              <>
                {/* initial cabin options */}
                {!selectedCabin &&
                  initialOptions.map((it, i) => (
                    <RoomOption
                      key={i}
                      item={it}
                      active={it.id === selectedRoom?.id}
                    />
                  ))}
                {/* selected cabin's rooms */}
                {selectedCabin && (
                  <>
                    <Anchor
                      size="xs"
                      className="block w-full px-2 py-1"
                      onClick={() => {
                        updateRoomData({ room: null, cabin: null });
                      }}
                    >
                      &larr; Back
                    </Anchor>
                    {rooms
                      .filter((it) => it.cabin?.id === selectedCabin.id)
                      .map((it, i) => (
                        <RoomOption
                          key={i}
                          item={it}
                          active={it.id === selectedRoom?.id}
                        />
                      ))}
                  </>
                )}
              </>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
};
export default RoomSelector;
