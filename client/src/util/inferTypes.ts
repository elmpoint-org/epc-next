export type Inside<Arr> = Arr extends Array<infer T> ? T : never;
