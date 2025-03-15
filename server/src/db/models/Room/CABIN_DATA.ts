/*
THIS FILE IS IMPORTED BY THE CLIENT.
only raw types and client-friendly imports are allowed.
*/

export const ROOT_CABIN_ID = 'ROOT';
export const ANY_ROOM = 'ANY';

export const CUSTOM_ROOM_ID = '00000000-0000-0000-0000-000000000000';
export const CUSTOM_ROOM_OBJ = (name: string) => ({
  id: CUSTOM_ROOM_ID,
  name: name,
  cabin: null,
  aliases: [],
  beds: 0,
  availableBeds: 0,
  noCount: true,
  forCouples: false,
});
