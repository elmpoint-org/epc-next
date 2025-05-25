import { useEffect, useState } from 'react';

export type ReverseCbProp = { val: boolean; reset: () => void };

export const useReverseCbTrigger = () => {
  const [s, setS] = useState(false);

  const cbProp: ReverseCbProp = {
    val: s,
    reset: () => setS(false),
  };

  return { prop: cbProp, trigger: () => setS(true) };
};

export const useReverseCb = (ch: ReverseCbProp, cb: () => void) => {
  useEffect(() => {
    if (ch.val) {
      ch.reset();
      cb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ch.val]);
};
