import { authErrorMap } from '@/app/auth/_util/authErrors';
import { pkeyErrorMap, usePkey } from '@/app/auth/passwordless';
import { graph, graphAuth, graphError, graphql } from '@/query/graphql';
import { queryClient } from '@/query/query';
import { Button, CloseButton, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { GraphQLError } from 'graphql';
import { FormEvent, useState, useTransition } from 'react';
import { USE_USER_DATA } from '../_ctx/userData';
import LoadingBlurFrame from '@/app/_components/_base/LoadingBlurFrame';

export default function NewPasskey() {
  const [text, setText] = useState('');
  const [isLoading, loading] = useTransition();

  const pkey = usePkey();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!text.length)
      return notifications.show({
        color: 'red',
        message: 'Please enter a name for your passkey.',
      });

    loading(async () => {
      if (!pkey.current) return;
      // get token
      let token;
      try {
        const data = await graphAuth(
          graphql(`
            mutation Mutation {
              userCreateCredential
            }
          `),
        );
        if (!data?.userCreateCredential) throw 'UNKNOWN';
        token = data.userCreateCredential;
      } catch (e: any) {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: authErrorMap(graphError(e.response)),
        });
        return;
      }

      // register credential
      const { token: success, error } = await pkey.current.register(
        token,
        text,
      );
      if (!success || error) {
        notifications.show({
          color: 'red',
          title: 'Passkey error',
          message: pkeyErrorMap(error?.errorCode),
        });
        return;
      }

      // refetch and show success
      queryClient.invalidateQueries({ queryKey: USE_USER_DATA });
      setText('');
      notifications.show({ message: 'Success!' });
    });
  }

  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg">Add a passkey</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-end gap-2 rounded-md p-2">
            <TextInput
              label="Nickname"
              description="This is how you'll recognize what device this passkey is stored on. You won't be able to change it without deleting it and starting over."
              placeholder="my laptop"
              className="flex-1"
              value={text}
              onChange={(event) => setText(event.currentTarget.value)}
              rightSection={
                text && (
                  <CloseButton
                    size="sm"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setText('')}
                  />
                )
              }
            />
            <Button type="submit">Create passkey</Button>
          </div>
        </form>

        {isLoading && <LoadingBlurFrame />}
      </div>
    </>
  );
}
