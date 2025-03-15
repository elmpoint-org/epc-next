'use client';

import { Fragment, useEffect, useTransition } from 'react';

import { ActionIcon, Button, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconEdit, IconRestore } from '@tabler/icons-react';

import { invalidateUserData, useUserData } from '../_ctx/userData';
import { useUser } from '@/app/_ctx/user/context';
import { oldGraphAuth, oldGraphError, graphql } from '@/query/graphql';
import { notifications } from '@mantine/notifications';
import { invalidateUser } from '@/app/_ctx/user/actions';
import fdeq from 'fast-deep-equal';
import { z } from 'zod';
import CopyID from '@/app/_components/_base/CopyID';

const AccountDetails = () => {
  const initialUser = useUser();

  const formInit = {
    name: initialUser?.name ?? '',
    firstName: initialUser?.firstName ?? '',
    email: initialUser?.email ?? '',
  } satisfies Partial<typeof user>;

  const form = useForm({
    mode: 'controlled',
    initialValues: formInit,
    validate: zodResolver(
      z.object(
        Object.keys(formInit).reduce(
          (o, k) => ({
            ...o,
            [k]: z.string().min(1, { message: 'Field cannot be blank.' }),
          }),
          {},
        ),
      ),
    ),
    transformValues: (v) => ({
      name: v.name.trim(),
      firstName: v.firstName.trim(),
      email: v.email.trim(),
    }),
  });

  // load dynamic user state and detect changes
  const user = useUserData();
  useEffect(() => {
    if (!user) return;

    const nu = Object.keys(user).reduce(
      (o, k) =>
        !(k in formInit)
          ? { ...o }
          : { ...o, [k]: user[k as keyof typeof user] ?? '' },
      {} as typeof formInit,
    );
    console.log('reval', user, nu);
    form.setInitialValues(nu);
    if (fdeq(nu, form.getValues())) form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [isLoading, loading] = useTransition();
  function handleSubmit(values: typeof formInit) {
    loading(async () => {
      if (!user) return;
      const f = await oldGraphAuth(
        graphql(`
          mutation UserUpdate(
            $id: ID!
            $name: String
            $firstName: String
            $email: String
          ) {
            userUpdate(
              id: $id
              name: $name
              firstName: $firstName
              email: $email
            ) {
              id
            }
          }
        `),
        {
          id: user.id,
          ...values,
        },
      ).catch((err) => {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: oldGraphError((err as any).response),
        });
        return false;
      });
      if (!f) return;

      //revalidate
      invalidateUserData();
      await invalidateUser();
    });
  }

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
          {/* title */}
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-lg">Edit your profile</h3>
            <div className="flex flex-row items-center gap-2">
              <ActionIcon
                variant="subtle"
                disabled={!form.isDirty()}
                className="data-[disabled]:invisible"
                onClick={() => form.reset()}
              >
                <IconRestore className="h-5" />
              </ActionIcon>
              <Button
                type="submit"
                size="compact-md"
                disabled={!form.isDirty()}
                loading={isLoading}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-lg sm:flex-row">
            {/* avatar view */}
            <div className="relative flex flex-col items-center rounded-xl p-4 sm:max-w-56">
              <a
                href="https://gravatar.com/profile"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative -m-2 rounded-full border border-slate-500 border-opacity-0 p-2 text-slate-500 hover:border-opacity-100"
              >
                <div
                  className="size-36 rounded-full bg-slate-300 bg-cover bg-center"
                  style={{ backgroundImage: `url(${initialUser?.avatarUrl})` }}
                />
                <IconEdit className="invisible absolute right-0 top-0 size-6 p-1 group-hover:visible" />
              </a>
              <div className="flex max-w-full flex-col items-center p-2 text-sm">
                <div className="max-w-full truncate font-bold">
                  {initialUser?.name}
                </div>
                <div className="max-w-full truncate">{initialUser?.email}</div>
              </div>
            </div>

            {/* text fields */}
            <div className="flex flex-1 flex-col gap-2 p-2">
              <TextInput
                label="name"
                placeholder="Enter name"
                classNames={{
                  label: 'capitalize',
                }}
                {...form.getInputProps('name')}
              />
              <TextInput
                label="first name"
                placeholder="Enter first name"
                rightSectionWidth={80}
                rightSection={
                  <Button
                    size="compact-xs"
                    variant="light"
                    classNames={{
                      root: 'mx-2 rounded-full uppercase',
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      const nv = form.getValues().name.trim().split(' ')?.[0];
                      if (nv) form.setValues({ firstName: nv });
                    }}
                  >
                    generate
                  </Button>
                }
                classNames={{
                  label: 'capitalize',
                  section: 'data-[position=right]:w-auto',
                }}
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="email"
                placeholder="Enter email"
                type="email"
                classNames={{
                  label: 'capitalize',
                }}
                {...form.getInputProps('email')}
              />

              {/* email warning */}
              <details className="rounded-md border border-transparent p-3 text-xs open:border-red-800/50 open:bg-red-400/20">
                <summary className="cursor-pointer text-red-800 hover:underline">
                  Be cautious about changing your email. (click for more)
                </summary>
                <div className="mt-1 space-y-3 p-2 text-sm text-red-900">
                  <p>
                    <b>
                      If you don’t have access to the email you list here, you
                      may become unable to login.
                    </b>{' '}
                    Double check that it’s correct.
                  </p>
                  <p>
                    Additionally, your passkeys are stored with an email address
                    which is shown to you upon login. Changing the email listed
                    here{' '}
                    <b>
                      will not update the email address shown on your passkey
                    </b>
                    , although the passkeys will still work. All passkey
                    managers allow you to manually change their stored email
                    address.
                  </p>
                </div>
              </details>
            </div>
          </div>

          {/* USER SCOPE */}
          {!!initialUser?.scope?.length && (
            <div className="-mb-0.5 pr-8 text-xs leading-relaxed">
              <span className="">YOUR PERMISSIONS: </span>
              {initialUser?.scope?.map((it) => (
                <Fragment key={it}>
                  <code className="ml-1 rounded-md bg-slate-200 p-1">{it}</code>{' '}
                </Fragment>
              ))}
            </div>
          )}

          {/* copy ID */}
          {initialUser && (
            <div
              className="absolute bottom-4 right-4 flex flex-row data-[left]:left-4"
              data-left={!initialUser.scope?.length || null}
            >
              <CopyID id={initialUser.id} />
            </div>
          )}
        </div>
      </form>
    </>
  );
};
export default AccountDetails;
