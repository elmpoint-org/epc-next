import { authErrorMap } from '@/app/auth/_util/authErrors';
import { pkeyErrorMap, usePkey } from '@/app/auth/passwordless';
import { oldGraphAuth, oldGraphError, graphql } from '@/query/graphql';
import { Button, CloseButton, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FormEvent, useState, useTransition } from 'react';
import { invalidateUserData } from '../_ctx/userData';
import LoadingBlurFrame from '@/app/_components/_base/LoadingBlurFrame';

export default function NewPasskey({ onClose }: { onClose?: () => void }) {
  const [text, setText] = useState('');
  const [isLoading, loading] = useTransition();

  const pkey = usePkey();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    loading(async () => {
      if (!pkey.current) return;
      // get token
      let token;
      try {
        const data = await oldGraphAuth(
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
          message: authErrorMap(oldGraphError(e.response)),
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
          autoClose: 8000,
        });
        return;
      }

      // refetch and show success
      invalidateUserData();
      setText('');
      notifications.show({ message: 'Success!' });
    });
  }

  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg">Add a passkey</h3>
          <CloseButton aria-label="close" onClick={onClose} />
        </div>

        <div className="space-y-4 p-2 pb-0 text-sm leading-normal text-slate-600">
          <p>
            When you click <b>Create passkey</b> below, you’ll be prompted to
            store a new passkey on your device. Type a nickname first, if you’d
            like one.
          </p>

          <details className="max-w-[80ch] sm:px-2">
            <summary className="cursor-pointer hover:underline">
              &nbsp;More information&hellip;
            </summary>
            <div className="mt-2 space-y-4 sm:mt-1 sm:p-2">
              <p>
                Your device might ask you to choose where you’d like to store
                the passkey. Typically, the default will be to save locally on
                your device. It might also offer to save the passkey to your
                password manager or your Google/iCloud account. Choose the
                option that works best for you. Remember, you can always create
                additional passkeys later.
              </p>
              <p>
                It might be helpful for you to add a nickname below. This name
                is just for you—it’s here so you remember where you stored this
                passkey. In most cases, we can auto-detect the service you use
                (e.g. “Apple Passwords” or “Google Chrome”), but you might like
                something more specific like “my work laptop”.
              </p>
            </div>
          </details>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 rounded-md p-2 sm:flex-row sm:items-end">
            <TextInput
              label={<>Nickname (optional)</>}
              description={
                <>
                  Where your passkey will be stored. Heads up: you won’t be able
                  to change this name again.
                </>
              }
              placeholder="e.g. “my laptop”"
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
            <Button type="submit" className="self-end">
              Create passkey
            </Button>
          </div>
        </form>

        {isLoading && <LoadingBlurFrame />}
      </div>
    </>
  );
}
