export type Inside<Arr> = Arr extends Array<infer T> ? T : never;

export type SharedValues<T, U> = {
  [K in SharedKeys<T, U>]: T[K];
};
type SharedKeys<T, U> = {
  [K in keyof T & keyof U]: T[K] extends U[K] ? K : never;
}[keyof T & keyof U];
