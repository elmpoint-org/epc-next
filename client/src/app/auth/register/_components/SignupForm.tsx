'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import { Button, Fieldset, Loader, TextInput } from '@mantine/core';

import { trpc } from '@/query/trpc';
import type { Client } from '@passwordlessdev/passwordless-client';
import { initPasswordless, usePkey } from '../../passwordless';
import { notifications } from '@mantine/notifications';
import { authErrorMap } from '../../_util/authErrors';

const SignupForm = () => {
  const [email, setEmail] = useState('');

  const pkey = usePkey();

  const registerFn = trpc.auth.register.useMutation();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pkey.current) return;

    if (!email.length)
      return notifications.show({
        color: 'red',
        message: 'Please enter an email.',
      });

    const token = await registerFn.mutateAsync({ email }).catch(() => {
      notifications.show({
        color: 'red',
        // title: 'Request failed',
        message: authErrorMap(registerFn.error?.message),
      });
    });
    if (!token) return;

    // register user
    const { token: success, error } = await pkey.current.register(
      token,
      'new device!',
    );
    if (success) {
      console.log('success');
    } else {
      console.log(error);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Fieldset className="space-y-4 rounded-lg">
          <TextInput
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={handleChange}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={registerFn.isPending}
          >
            {registerFn.isPending ? (
              <>
                <Loader size="sm" />
              </>
            ) : (
              <>Activate account</>
            )}
          </Button>
        </Fieldset>
      </form>
    </>
  );
};
export default SignupForm;
