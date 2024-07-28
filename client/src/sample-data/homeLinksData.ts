export type HomeLink = {
  id: string;
  order: number;
  url: string;
  name: string;
  description: string;
  flags: {
    external?: boolean;
    secure?: boolean;
    highlight?: boolean;
  };
  timestamp: { created: number; updated: number };
};

export const homeLinks: HomeLink[] = [
  {
    id: '7577205b-9b79-48c3-bca5-e6bbe3efe6dc',
    order: 0,
    url: '/calendar',
    name: 'Visitor calendar',
    description:
      'Click here to see camp availability and let everyone know when you’re coming.',
    flags: { secure: true, highlight: true },
    timestamp: { created: 1672524367, updated: 1672530391 },
  },
  {
    id: 'abc123',
    order: 1,
    url: '/pages/links',
    name: 'Recent Updates & Links',
    description:
      'The most up-to-date resources added by board members and website admins.',
    flags: { secure: true },
    timestamp: { created: 0, updated: 0 },
  },
  {
    id: '40fe1322-4b02-46ab-b124-bbfd2d3851b9',
    order: 2,
    url: '/projects',
    name: 'Project list',
    description:
      'Click to find the current “fridge list” of tasks needed to keep camp in good condition. Please work on a task (or a few!) while you’re here.',
    flags: { secure: true },
    timestamp: { created: 1672524367, updated: 1672530422 },
  },
  {
    id: '2685e0ec-c6ab-4739-9b7c-bcd1a1ee9e50',
    order: 3,
    url: '/documents',
    name: 'Document center',
    description:
      'This is where you can find important camp documentation like budget history, opening instructions, guest waivers, etc.',
    flags: { secure: true },
    timestamp: { created: 1672524367, updated: 1672531547 },
  },

  {
    id: '346109ef-110b-4510-8e1d-147860ed930a',
    order: 4,
    url: '/history',
    name: 'Elm Point history',
    description:
      'Click here to read about family history, browse old photos, and help out with research efforts.',
    flags: { secure: true },
    timestamp: { created: 1672524367, updated: 1672530486 },
  },
  {
    id: 'ed535159-59a8-4d31-a6c4-7d12834c3676',
    order: 5,
    url: '/directions',
    name: 'Directions',
    description:
      'Click here to see Google Maps directions from your location to Elm Point.',
    flags: { external: true },
    timestamp: { created: 1672524367, updated: 1672530499 },
  },
];

// {
//   id: 'c5605c6b-c202-4038-9705-50103a59b937',
//   order: 3,
//   url: '/photocontest',
//   name: 'Photo contest',
//   description:
//     'Click here to submit your entry to the annual photo contest, and browse past years’ submissions!',
//   flags: {},
//   timestamp: { created: 1672524367, updated: 1672530457 },
// },
