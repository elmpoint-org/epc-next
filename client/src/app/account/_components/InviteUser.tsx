'use client';

import { FormEvent, useState, useTransition } from 'react';

import { Button, CloseButton, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { graphAuth, graphError, graphql } from '@/query/graphql';

import LoadingBlurFrame from '@/app/_components/_base/LoadingBlurFrame';

export default function InviteUser() {
  const [email, setEmail] = useState('');
  const [isLoading, loading] = useTransition();
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.length)
      return notifications.show({
        color: 'red',
        message: 'Please enter a valid email.',
      });

    loading(async () => {
      const r = await graphAuth(
        graphql(`
          mutation PreUserCreate($email: String!) {
            preUserCreate(email: $email) {
              id
            }
          }
        `),
        { email },
      ).catch((err) => {
        notifications.show({
          color: 'red',
          message: 'Error: ' + graphError((err as any).response) ?? '',
        });
        // TODO what error map applies here
        return false;
      });
      if (!r) return;

      // handle success
      setEmail('');
      notifications.show({ message: 'Success!' });
      // TODO needs more instruction
    });
  }

  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg">Invite a user</h3>
        </div>
        <div className="p-2 pb-0 text-slate-600">
          <p>Enter someone’s email below to invite them to the EPC website.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 rounded-md p-2 sm:flex-row sm:items-end">
            <TextInput
              label="Email"
              placeholder="Enter their email"
              type="email"
              required
              className="flex-1"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              rightSection={
                email && (
                  <CloseButton
                    size="sm"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setEmail('')}
                  />
                )
              }
            />
            <Button type="submit" className="self-end">
              Invite user
            </Button>
          </div>
        </form>

        {isLoading && <LoadingBlurFrame />}
      </div>
    </>
  );
}
