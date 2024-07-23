'use client';

import { createContext, useContext, useState } from 'react';

export interface Cabin {
  id: string;
  name: string;
  aliases: string[];
  useAlias?: number;

  rooms?: Room[];
}
export interface Room {
  id: string;
  cabin: Partial<Cabin> | null;
  name: string;
  aliases: string[];
  useAlias?: string;

  beds: number;
  availableBeds: number;
  forCouples?: boolean;
  noCount?: boolean; // don't count bedrooms
}

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
};
export const FormCtx = createContext<FormCtx>({
  dates: [null, null],
  setDates: () => {},
  guests: [],
  setGuests: () => {},
  eventText: eventTextInitial(),
  setEventText: () => {},
});

export const FormCtxProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dates, setDates] = useState<DatesRange>([null, null]);
  const [guests, setGuests] = useState([guestInitial()]);
  const [eventText, setEventText] = useState(eventTextInitial());

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

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
