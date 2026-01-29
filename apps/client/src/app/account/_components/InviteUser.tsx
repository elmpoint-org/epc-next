'use client';

import { FormEvent, useMemo, useState, useTransition } from 'react';

import { Button, CloseButton, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import {
  oldGraphAuth,
  oldGraphError,
  graphql,
  graphAuth,
} from '@/query/graphql';

import LoadingBlurFrame from '@/app/_components/_base/LoadingBlurFrame';
import A from '@/app/_components/_base/A';
import { prettyErrorPlaceholder } from '@/util/prettyErrors';

export default function InviteUser() {
  const [email, setEmail] = useState('');
  const [isLoading, loading] = useTransition();
  const [finalEmailLink, setFinalEmailLink] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.length)
      return notifications.show({
        color: 'red',
        message: 'Please enter a valid email.',
      });

    loading(async () => {
      const { data, errors } = await graphAuth(
        graphql(`
          mutation PreUserCreate($email: String!) {
            preUserCreate(email: $email) {
              id
            }
          }
        `),
        { email },
      );
      if (errors || !data?.preUserCreate) {
        notifications.show({
          color: 'red',
          message: prettyErrorPlaceholder(errors?.[0]?.code),
        });
        return;
      }

      // handle success
      setFinalEmailLink(
        new URL(
          `/auth/register?${new URLSearchParams(
            Object.entries({
              email: email.trim().toLowerCase(),
            }),
          ).toString()}`,
          window.location.href,
        ).toString(),
      );
      setEmail('');
    });
  }

  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg">Invite another user</h3>
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

        {/* SUCCESS MESSAGE */}
        {finalEmailLink && (
          <div className="mt-2 space-y-2 px-2 text-sm text-slate-600 sm:px-4">
            <p>
              <b>Success!</b> Now direct them to{' '}
              <A
                href="/pages/help/account/register"
                target="_blank"
                rel="noopener noreferrer"
              >
                this help page
              </A>
              , or send them this direct link to create their account:
            </p>

            <p>
              <A
                target="_blank"
                rel="noopener noreferrer"
                href={finalEmailLink}
              >
                {finalEmailLink}
              </A>
            </p>
          </div>
        )}

        {isLoading && <LoadingBlurFrame />}
      </div>
    </>
  );
}
