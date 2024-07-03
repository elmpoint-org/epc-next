import { Attribute } from '@tiptap/core';

type AttsBase = Record<string, string>;
type RecordType<T> = T extends Record<any, infer R> ? R : never;

export type AddAttributes<Atts extends AttsBase> = Record<
  keyof Atts,
  Omit<Attribute, 'keepOnSplit' | 'renderHTML'> & {
    keepOnSplit?: Attribute['keepOnSplit'];
    renderHTML?: (atts: Atts) => ReturnType<Attribute['renderHTML'] & {}>;
  }
>;

/** get a typed `att()` function for defining data attributes */
export const getTypedAtt =
  <Atts extends AttsBase>() =>
  <AttKey extends keyof Atts>(p: {
    att: AttKey;
    default: Atts[AttKey];
    data: string;
  }): RecordType<AddAttributes<any>> => ({
    default: p.default,
    parseHTML: (el) => el.getAttribute(p.data),
    renderHTML: (a) => ({ [p.data]: a[p.att] }),
  });

3;
