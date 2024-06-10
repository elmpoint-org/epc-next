'use client';

import { useEffect, useRef, useState } from 'react';
import {
  TokenResponseType,
  initPasswordless,
  usePkey,
} from '../../passwordless';
import { Client } from '@passwordlessdev/passwordless-client';

const Autofill = (props: { onSubmit?: (token: TokenResponseType) => void }) => {
  const pkey = useRef<Client | null>(null);

  const [exactlyOnce, setExactlyOnce] = useState(true);

  useEffect(() => {
    if (pkey.current) return; // only register once
    pkey.current = initPasswordless();
    const p = pkey.current;

    p.signinWithAutofill().then(props.onSubmit);

    // abort if this goes out of scope
    return () => {
      console.log('aborting...');

      p.abort();
      pkey.current = null;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="hidden"></div>
    </>
  );
};
export default Autofill;
