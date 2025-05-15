'use client';

import { createContext, useContext, useState } from 'react';

import type { SetState } from '@/util/stateType';
import { Room as RoomRoot, Cabin as CabinRoot } from './getRoomData';

export type Cabin = CabinRoot;
export type Room = RoomRoot;

export type GuestEntry = {
  name: string;
  room: {
    room: Room | null;
    cabin: Cabin | null;
  };
};
export const guestInitial = (): GuestEntry => ({
  name: '',
  room: { room: null, cabin: null },
});

export type DatesRange = [Date | null, Date | null];

export type EventText = { title: string; description: string };
export const eventTextInitial = (): EventText => ({
  title: '',
  description: '',
});

export type FormCtx = {
  dates: DatesRange;
  setDates: SetState<DatesRange>;
  guests: GuestEntry[];
  setGuests: SetState<GuestEntry[]>;
  eventText: EventText;
  setEventText: SetState<EventText>;
  updateId: string | null;
  showDate?: Date;
};
export const FormCtx = createContext<FormCtx>({
  dates: [null, null],
  setDates: () => {},
  guests: [],
  setGuests: () => {},
  eventText: eventTextInitial(),
  setEventText: () => {},
  updateId: null,
});

export type InitialStayValue = {
  id: string;
  dates: DatesRange;
  guests: GuestEntry[];
  eventText: EventText;
};

export const FormCtxProvider = ({
  children,
  initial,
  showDate,
}: {
  children: React.ReactNode;
  initial?: InitialStayValue;
  showDate?: Date;
}) => {
  const [dates, setDates] = useState<DatesRange>(
    initial?.dates ?? [null, null],
  );
  const [guests, setGuests] = useState(initial?.guests ?? [guestInitial()]);
  const [eventText, setEventText] = useState(
    initial?.eventText ?? eventTextInitial(),
  );

  return (
    <>
      <FormCtx.Provider
        value={{
          dates,
          setDates,
          guests,
          setGuests,
          eventText,
          setEventText,
          updateId: initial?.id ?? null,
          showDate,
        }}
      >
        {/*  */}
        {children}
      </FormCtx.Provider>
    </>
  );
};

export const useFormCtx = () => useContext(FormCtx);

export const useFormCtxRoomState = (i: number) => {
  const { guests, setGuests } = useContext(FormCtx);

  const selectedRoom = guests[i].room.room;
  const selectedCabin = guests[i].room.cabin;

  const updateRoomData = (updates: Partial<GuestEntry['room']>) =>
    setGuests((g) => {
      const gg = [...g];
      gg[i].room = { ...gg[i].room, ...updates };
      return gg;
    });

  const setSelectedRoom = (room: Room | null) => updateRoomData({ room });
  const setSelectedCabin = (cabin: Cabin | null) => updateRoomData({ cabin });

  return {
    selectedRoom,
    selectedCabin,
    updateRoomData,
    setSelectedRoom,
    setSelectedCabin,
  };
};
