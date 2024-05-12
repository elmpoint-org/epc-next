export interface Cabin {
  id: string;
  name: string;
  rooms?: Room[];
  aliases: string[];
}
export interface Room {
  id: string;
  cabin: Partial<Cabin> | null;
  name: string;
  aliases: string[];
  beds: number;
  availableBeds: number;
  forCouples?: boolean;
  noCount?: boolean; // don't count bedrooms
}

export const cabins: Cabin[] = [
  {
    id: '0',
    name: 'Ide Cabin',
    aliases: [],
  },
  {
    id: '1',
    name: 'House',
    aliases: [],
  },
  {
    id: '2',
    name: 'Foster Cabin',
    aliases: [],
  },
  {
    id: '3',
    name: 'Kendrew Cabin',
    aliases: [],
  },
  {
    id: '4',
    name: 'Tent Floors',
    aliases: [],
  },
];
export const rooms: Room[] = [
  {
    id: '0a',
    cabin: { id: '0' },
    name: 'Bedroom 1',
    beds: 1,
    availableBeds: 0,
    forCouples: true,
    aliases: [],
  },
  {
    id: '0b',
    cabin: { id: '0' },
    name: 'Bedroom 2',
    beds: 1,
    availableBeds: 0,
    forCouples: true,
    aliases: [],
  },
  {
    id: '0c',
    cabin: { id: '0' },
    name: 'Bedroom 3',
    beds: 1,
    availableBeds: 0,
    forCouples: true,
    aliases: [],
  },
  {
    id: '0d',
    cabin: { id: '0' },
    name: 'Bunk Room',
    beds: 4,
    availableBeds: 0,
    forCouples: false,
    aliases: [],
  },
  {
    id: '1a',
    cabin: { id: '1' },
    name: 'Master Bedroom',
    beds: 1,
    availableBeds: 0,
    forCouples: true,
    aliases: [],
  },
  {
    id: '1b',
    cabin: { id: '1' },
    name: 'Corner Bedroom',
    beds: 2,
    availableBeds: 1,
    forCouples: false,
    aliases: [],
  },
  {
    id: '1c',
    cabin: { id: '1' },
    name: 'Middle Room',
    beds: 2,
    availableBeds: 0,
    forCouples: false,
    aliases: [],
  },
  {
    id: '2a',
    cabin: { id: '2' },
    name: 'Master Bedroom',
    beds: 1,
    availableBeds: 1,
    forCouples: true,
    aliases: [],
  },
  {
    id: '2b',
    cabin: { id: '2' },
    name: 'Middle Room',
    beds: 1,
    availableBeds: 1,
    forCouples: true,
    aliases: [],
  },
  {
    id: '2c',
    cabin: { id: '2' },
    name: 'Bunk Room',
    beds: 5,
    availableBeds: 4,
    forCouples: false,
    aliases: [],
  },
  {
    id: '3a',
    cabin: { id: '3' },
    name: 'Bedroom 1',
    beds: 1,
    availableBeds: 0,
    forCouples: true,
    aliases: [],
  },
  {
    id: '3b',
    cabin: { id: '3' },
    name: 'Bedroom 2',
    beds: 1,
    availableBeds: 0,
    forCouples: true,
    aliases: [],
  },
  {
    id: 'g',
    cabin: null,
    name: "Gay's Cabin",
    beds: 1,
    availableBeds: 1,
    forCouples: true,
    aliases: [],
  },
  {
    id: '4a',
    cabin: { id: '4' },
    name: 'North Tent Floor',
    beds: 1,
    availableBeds: 1,
    forCouples: true,
    aliases: [],
  },
  {
    id: '4b',
    cabin: { id: '4' },
    name: 'South Tent Floor',
    beds: 1,
    availableBeds: 1,
    forCouples: true,
    aliases: [],
  },
  {
    id: 'dd',
    cabin: null,
    name: 'Day Tripper',
    beds: 0,
    availableBeds: 0,
    noCount: true,
    aliases: [],
  },
];
