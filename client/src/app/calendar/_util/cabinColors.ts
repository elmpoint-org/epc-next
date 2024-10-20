import { clx } from '@/util/classConcat';

const COLOR_MAP: Record<string, CabinColor> = {
  '574ce1ab-6aa6-4ea5-a082-683125b417a7': 'RED', // ide cabin
  '74dab16d-04fe-4f2e-b872-ea3d59e56514': 'GREEN', // foster cabin
  'b47f9a87-2993-4598-982b-da751486036f': 'YELLOW', // kendrew cabin
  'bf802b84-2813-4438-b2da-f997c138a14a': 'ORANGE', // house
  '649d65b6-9a50-491f-b0f2-8a0e22ee6275': 'PINK', // gay's cabin
  '662357e8-953b-4a7b-844d-003c317860c8': 'BLUE', // day tripper
};

export const CABIN_COLORS = {
  DEFAULT: {
    main: clx('border-slate-600 bg-slate-600/10 text-slate-950 ring-slate-600'),
    specialty: clx('text-slate-800'),
    selected: clx('border-slate-600 bg-slate-300/20 text-slate-900'),
    swatch: clx('bg-slate-600'),
  },
  BLUE: {
    main: clx('border-sky-600 bg-sky-600/30 text-sky-950 ring-sky-600'),
    specialty: clx('text-sky-800'),
    selected: clx('border-sky-600 bg-sky-300/20 text-sky-900'),
    swatch: clx('bg-sky-600'),
  },
  RED: {
    main: clx('border-black/40 bg-rose-400/30 text-rose-950 ring-rose-600'),
    specialty: clx('text-rose-900/80'),
    selected: clx('border-rose-600 bg-rose-300/20 text-rose-900'),
    swatch: clx('bg-rose-600'),
  },
  YELLOW: {
    main: clx(
      'border-yellow-700/50 bg-yellow-400/30 text-yellow-950 ring-yellow-600',
    ),
    specialty: clx('text-yellow-800'),
    selected: clx('border-yellow-600 bg-yellow-300/20 text-yellow-900'),
    swatch: clx('bg-yellow-500'),
  },
  ORANGE: {
    main: clx(
      'border-orange-600 bg-orange-600/30 text-orange-950 ring-orange-600',
    ),
    specialty: clx('text-orange-900/85'),
    selected: clx('border-orange-600 bg-orange-300/20 text-orange-900'),
    swatch: clx('bg-orange-600'),
  },
  GREEN: {
    main: clx(
      'border-emerald-600 bg-emerald-600/30 text-emerald-950 ring-emerald-600',
    ),
    specialty: clx('text-emerald-800'),
    selected: clx('border-emerald-600 bg-emerald-300/20 text-emerald-900'),
    swatch: clx('bg-emerald-600'),
  },
  PINK: {
    main: clx(
      'border-fuchsia-600 bg-fuchsia-400/30 text-fuchsia-950 ring-fuchsia-600',
    ),
    specialty: clx('text-fuchsia-800'),
    selected: clx('border-fuchsia-600 bg-fuchsia-300/20 text-fuchsia-900'),
    swatch: clx('bg-fuchsia-500'),
  },
  NATIVE: {
    main: clx(
      'border-dashed border-slate-500/50 bg-slate-300/30 ring-slate-300',
    ),
    specialty: clx('text-slate-800'),
    selected: clx('border-slate-600 bg-slate-300/20 text-slate-900'),
    swatch: clx('bg-slate-600'),
  },
} satisfies Record<string, CabinColorObject>;
export type CabinColorObject = {
  main: string;
  specialty: string;
  swatch: string;
  selected: string;
};
export type CabinColor = keyof typeof CABIN_COLORS;

export function getCabinColor(id?: string): CabinColor | undefined {
  if (!id) return;
  return COLOR_MAP[id];
}

export function getCabinColorObject<WD extends boolean | undefined>(
  id?: string,
  withDefault?: WD,
): WD extends true ? CabinColorObject : CabinColorObject | undefined {
  let key = getCabinColor(id);
  if (!key) {
    if (withDefault) key = 'DEFAULT';
    else return undefined as any;
  }
  return CABIN_COLORS[key];
}
