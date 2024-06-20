'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

import { Button, CloseButton, Fieldset, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconRestore } from '@tabler/icons-react';

import { trpc } from '@/query/trpc';
import { TRPCClientError } from '@trpc/client';
import { authErrorMap } from '../../_util/authErrors';

import StoreLoginAndRedirect from '../../_components/StoreLoginAndRedirect';
import LoadingBlurFrame from '@/app/_components/_base/LoadingBlurFrame';

// COMPONENT
export default function CreateAccountForm({
  preUser,
  token,
}: {
  preUser: { email: string; name: string | null; [key: string]: unknown };
  token: string;
}) {
  const [email, setEmail] = useState(preUser.email);
  const [name, setName] = useState(preUser.name ?? '');

  const defaultFirstName = useMemo(
    () => name.trim().split(' ')?.[0] ?? '',
    [name],
  );
  const [isDefaultName, setIsDefaultName] = useState(true);
  const [firstName, setFirstName] = useState(defaultFirstName);
  useEffect(() => {
    if (!isDefaultName) return;
    setFirstName(defaultFirstName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, isDefaultName]);
  function changeFirstName(e: ChangeEvent<HTMLInputElement>) {
    if (isDefaultName) setIsDefaultName(false);
    setFirstName(e.currentTarget.value);
  }

  const userCreateFn = trpc.register.createUser.useMutation();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // validate
    if (!(email.length && name.length && firstName.length))
      return notifications.show({
        color: 'red',
        message: 'Not all fields are filled out correctly.',
      });

    setIsLoading(true);

    // create user
    const at = await userCreateFn
      .mutateAsync({
        user: {
          email,
          name,
          firstName,
        },
        token,
      })
      .catch((err) => {
        setIsLoading(false);
        notifications.show({
          color: 'red',
          message: authErrorMap(err instanceof TRPCClientError && err.message),
        });
      });
    if (!at) return;
    setAuthToken(at);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="relative">
        <Fieldset className="space-y-4 rounded-lg">
          <div className="border-b border-slate-300 py-2 text-sm">
            Make sure the account details below are correct, and then we’ll
            create your account.
          </div>

          {/* name */}
          <TextInput
            label="Full Name"
            placeholder="Enter your name"
            required
            value={name}
            onChange={({ currentTarget: { value: v } }) => setName(v)}
          />

          {/* auto first name */}
          <TextInput
            label="First Name"
            description={
              <>
                If the auto-generated name is wrong, click <b>customize</b> to
                change it.
              </>
            }
            required
            value={firstName}
            onChange={changeFirstName}
            disabled={isDefaultName ?? null}
            rightSectionPointerEvents="all"
            rightSection={
              isDefaultName ? (
                <Button
                  size="compact-xs"
                  variant="light"
                  classNames={{
                    root: 'mx-2 rounded-full uppercase',
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDefaultName(false);
                  }}
                >
                  customize
                </Button>
              ) : (
                <CloseButton
                  icon={<IconRestore size={20} />}
                  onClick={() => setIsDefaultName(true)}
                />
              )
            }
            classNames={{
              wrapper: 'group',
              input: 'data-[disabled]:text-dblack',
              section: 'data-[position=right]:group-data-[disabled]:w-auto',
            }}
          />

          {/* email */}
          <TextInput
            label="Email"
            description="You can use any email you’d like for your account, even if it’s not the one you were invited with."
            placeholder="Enter your email"
            required
            type="email"
            value={email}
            onChange={({ currentTarget: { value: v } }) => setEmail(v)}
          />

          {/* submit */}
          <Button type="submit" className="w-full">
            Create your account
          </Button>
        </Fieldset>

        {isLoading && <LoadingBlurFrame />}
      </form>
      {authToken && (
        <StoreLoginAndRedirect token={authToken} redirectTo="/account" />
      )}
    </>
  );
}
