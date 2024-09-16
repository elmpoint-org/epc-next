export type HomeLink = {
  order: number;
  url: string;
  name: string;
  description: string;
  flags: {
    external?: boolean;
    secure?: boolean;
    highlight?: boolean;
  };
};

export const homeLinks: HomeLink[] = [
  {
    order: 0,
    url: '/calendar',
    name: 'Visitor calendar',
    description:
      'Click here to see camp availability and let everyone know when you’re coming.',
    flags: { secure: true, highlight: true },
  },
  {
    order: 1,
    url: '/pages/links',
    name: 'Recent Updates & Links',
    description:
      'The most up-to-date resources added by board members and website admins.',
    flags: {},
  },
  {
    order: 2,
    url: '/pages/links/private',
    name: 'Project list',
    description:
      'Click to find the current “fridge list” of tasks needed to keep camp in good condition. Please work on a task (or a few!) while you’re here.',
    flags: { secure: true },
  },
  {
    order: 3,
    url: '/documents',
    name: 'Document center',
    description:
      'This is where you can find important camp documentation like budget history, opening instructions, guest waivers, etc.',
    flags: { secure: true },
  },
  {
    order: 4,
    url: '/history',
    name: 'Elm Point history',
    description:
      'Click here to read about family history, browse old photos, and help out with research efforts.',
    flags: { secure: true },
  },
  {
    order: 5,
    url: '/directions',
    name: 'Directions',
    description:
      'Click here to see Google Maps directions from your location to Elm Point.',
    flags: { external: true },
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
