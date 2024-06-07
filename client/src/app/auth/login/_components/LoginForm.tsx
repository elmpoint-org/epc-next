'use client';

import {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import type { Client } from '@passwordlessdev/passwordless-client';
import {
  type TokenResponseType,
  initPasswordless,
  pkeyErrorMap,
} from '../../passwordless';

import { trpc } from '@/query/trpc';
import cookies from '@/util/cookies';
import { authErrorMap } from '../../_util/authErrors';

import { Button, Fieldset, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

import LineLabel from '@/app/_components/_base/LineLabel';
import LoadingBlurFrame from '@/app/_components/_base/LoadingBlurFrame';
import { useRouter } from 'next/navigation';
import { TRPCClientError } from '@trpc/client';
import { useLogin } from '@/app/_ctx/userState';

const REDIRECT_DELAY = 200;

// COMPONENT
export default function LoginForm() {
  const [isLoading, loading] = useTransition();
  const router = useRouter();

  const login = useLogin();

  const [showPasskey, setShowPasskey] = useState(true);
  const pkey = useRef<Client | null>(null);
  const verifyFn = trpc.auth.verifyPasskey.useMutation();

  const [email, setEmail] = useState('');
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.currentTarget.value);
  const magicLinkFn = trpc.auth.sendMagicLink.useMutation();

  const sendMagicLink: FormEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email.length)
      return notifications.show({
        color: 'red',
        message: 'Please enter a valid email.',
      });

    loading(async () => {
      try {
        await magicLinkFn.mutateAsync({ email });
        notifications.show({
          title: 'Login link sent',
          message: 'Check your email!',
        });
      } catch (e) {
        notifications.show({
          color: 'red',
          message: authErrorMap(e instanceof TRPCClientError && e.message),
        });
      }
    });
  };

  // register autofill on mount
  useEffect(() => {
    (async () => {
      // init passwordless API
      pkey.current = initPasswordless();

      // check for compatibility
      if (
        !pkey.current.isBrowserSupported() &&
        !(await pkey.current.isPlatformSupported())
      ) {
        return setShowPasskey(false);
      }

      // // register passkey autofill
      // const t = await pkey.current.signinWithAutofill();
      // handlePasskeyLogin(t, true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle form submit with `use passkey` button
  const handlePasskey: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!pkey.current) return;

    // run passkey flow
    loading(async () => {
      const t = await pkey.current!.signinWithDiscoverable();
      handlePasskeyLogin(t);
    });
  };

  function handlePasskeyLogin(
    { token, error }: TokenResponseType,
    noError?: boolean,
  ) {
    if (error || !token) {
      if (error && noError && error.errorCode === 'unknown') return;
      return notifications.show({
        title: 'Passkey flow failed',
        message: pkeyErrorMap(error?.errorCode),
        autoClose: 8000,
        color: 'red',
      });
    }

    loading(async () => {
      // verify passkey
      const data = await verifyFn.mutateAsync({ token }).catch((e) => {
        notifications.show({
          color: 'red',
          title: 'Login failed',
          message: authErrorMap(e instanceof TRPCClientError && e.message),
        });
      });
      if (!data) return;

      // set login state
      login(data.token);
      notifications.show({
        title: 'Welcome back!',
        message: 'Successfully logged in.',
        icon: <IconCheck />,
      });
      setTimeout(() => router.push('/'), REDIRECT_DELAY);
    });
  }

  // RENDER
  return (
    <>
      <form onSubmit={sendMagicLink} className="relative">
        <Fieldset className="flex flex-col gap-3 rounded-lg p-5">
          {showPasskey && (
            <>
              <Button onClick={handlePasskey} className="w-full">
                Use passkey
              </Button>

              <LineLabel className="my-1">or</LineLabel>
            </>
          )}

          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            type="email"
            autoComplete="webauthn"
            classNames={{
              label: '-translate-y-1',
            }}
          />

          <Button
            type="submit"
            className="w-full data-[highlight]:my-1"
            data-highlight={!showPasskey || null}
            variant={showPasskey ? 'subtle' : 'filled'}
          >
            Email me a login link
          </Button>
        </Fieldset>

        {/* loading state */}
        {isLoading && <LoadingBlurFrame />}
      </form>
    </>
  );
}
