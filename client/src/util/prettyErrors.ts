export type ErrorMap = {
  __DEFAULT: string;
  [key: string]: string;
};

export const prettyError =
  (errorMap: ErrorMap, defaultFn?: (code: string) => string) =>
  (errorCode: unknown) => {
    const runDef = typeof errorCode === 'string' && defaultFn;

    if (typeof errorCode !== 'string') errorCode = '';
    const out =
      errorMap?.[errorCode as string] ??
      (runDef ? runDef(errorCode as string) : errorMap.__DEFAULT);
    if (out === errorMap.__DEFAULT && (errorCode as string).length)
      console.log('Unknown error code: ', errorCode);
    return out;
  };
