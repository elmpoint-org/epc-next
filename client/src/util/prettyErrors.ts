export type ErrorMap = { __DEFAULT: string } & Record<string, string>;

export const prettyError = (errorMap: ErrorMap) => (errorCode: unknown) => {
  if (typeof errorCode !== 'string') errorCode = '';
  const out = errorMap?.[errorCode as string] ?? errorMap.__DEFAULT;
  if (out === errorMap.__DEFAULT && (errorCode as string).length)
    console.log('Unknown error code: ', errorCode);
  return out;
};
