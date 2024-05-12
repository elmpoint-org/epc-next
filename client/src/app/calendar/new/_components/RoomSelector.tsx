import { useEffect, useMemo, useState } from 'react';

import {
  Anchor,
  CloseButton,
  Combobox,
  Pill,
  PillsInput,
  ScrollArea,
  useCombobox,
} from '@mantine/core';

import RoomOption from './RoomOption';

import { cabins, rooms, Cabin, Room } from '@/sampleRoomData';

const initialOptions = [...cabins, ...rooms.filter((it) => it.cabin === null)];

// COMPONENT
const RoomSelector = ({ className }: { className: string }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const initialize = () => {
    setSearch('');
    setSelectedCabin(null);
    setSelectedRoom(null);
  };

  const handleSelect = (id: string) => {
    setSearch('');

    const cabin = cabins.find((it) => it.id === id);
    if (cabin) {
      setSelectedRoom(null);
      setSelectedCabin(cabin);
      return;
    }
    const room = rooms.find((it) => it.id === id);
    if (room) {
      setSelectedRoom(room);
      if (room.cabin?.id && room.cabin.id !== selectedCabin?.id)
        setSelectedCabin(cabins.find((it) => it.id === room.cabin?.id) ?? null);
      combobox.closeDropdown();
    }

    // TODO handle custom entries
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => combobox.updateSelectedOptionIndex(), [selectedCabin]);

  const [search, setSearch] = useState('');

  const searchResults = useMemo(() => {
    let terms = search.toLowerCase().match(/\S+/g);
    if (!terms) return [];
    let a: (Cabin | Room)[] = [
      ...rooms.map((it) => ({
        ...it,
        name: it.cabin
          ? `${cabins.find(({ id }) => id === it.cabin?.id)?.name} / ${it.name}`
          : it.name,
      })),
    ];
    if (selectedCabin)
      a = a.filter((it) => (it as Room).cabin?.id === selectedCabin.id);
    else a.unshift(...cabins);

    return a.filter(
      (it) =>
        terms.length ===
        terms.reduce(
          (count, term) =>
            it.name.toLowerCase().includes(term) ? count + 1 : count,
          0,
        ),
    );
  }, [search, selectedCabin]);

  return (
    <>
      <Combobox store={combobox} onOptionSubmit={handleSelect}>
        <Combobox.DropdownTarget>
          <PillsInput
            label="Room"
            className={`${className}`}
            classNames={{
              input: 'space-x-2 flex flex-row items-center h-10',
            }}
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
                <Pill size="md" className="p-0">
                  <div>{selectedCabin.name}</div>
                </Pill>
                <span className="opacity-50">/</span>
              </>
            )}
            {selectedRoom && (
              <>
                <Pill size="md" className="p-0">
                  <div>{selectedRoom.name}</div>
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
                onChange={(e) => {
                  if (selectedRoom) return;
                  combobox.updateSelectedOptionIndex();
                  setSearch(e.currentTarget.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && search.length === 0) {
                    e.preventDefault();
                    if (selectedRoom) return setSelectedRoom(null);
                    setSelectedCabin(null);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </PillsInput>
        </Combobox.DropdownTarget>

        {/* dropdown menu */}
        <Combobox.Dropdown>
          <Combobox.Options className="relative">
            {/* <ScrollArea.Autosize
              mah={300}
              type="scroll"
              scrollbars="y"
              className="max-w-full"
              classNames={{
                viewport:'max-w-full'
              }}
            > */}
            {/* search results */}
            {search.trim().length ? (
              <>
                {searchResults.map((it, i) => (
                  <RoomOption key={i} item={it} active={false} />
                ))}
                {!selectedCabin ? (
                  <Combobox.Option value="SEARCH" className="">
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
                  <Combobox.Empty>No results found</Combobox.Empty>
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
                        setSelectedRoom(null);
                        setSelectedCabin(null);
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
            {/* </ScrollArea.Autosize> */}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
};
export default RoomSelector;
