'use client';

import { ChangeEvent, FormEvent, useState } from 'react';

import { Button, Fieldset, TextInput } from '@mantine/core';
import { trpc } from '@/query/trpc';
import { notifications } from '@mantine/notifications';
import { TRPCClientError } from '@trpc/client';
import { authErrorMap } from '../../_util/authErrors';
import LoadingBlurFrame from '@/app/_components/_base/LoadingBlurFrame';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }

  const verifyFn = trpc.register.checkReferral.useMutation();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.length)
      return notifications.show({
        color: 'red',
        message: 'Please enter a valid email.',
      });

    verifyFn
      .mutateAsync({ email })
      .then(() => {
        notifications.show({ message: 'Success! Check your email.' });
        setEmail('');
      })
      .catch((err) => {
        notifications.show({
          color: 'red',
          message: authErrorMap(err instanceof TRPCClientError && err.message),
          autoClose: 8000,
        });
      });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="relative">
        <Fieldset className="space-y-4 rounded-lg">
          <TextInput
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={handleChange}
          />

          <Button type="submit" className="w-full">
            Activate account
          </Button>
        </Fieldset>
        {verifyFn.isPending && <LoadingBlurFrame />}
      </form>
    </>
  );
};
export default SignupForm;
