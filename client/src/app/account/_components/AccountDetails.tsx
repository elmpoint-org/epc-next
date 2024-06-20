'use client';

import { useEffect, useTransition, type ReactNode } from 'react';

import { ActionIcon, Button, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconEdit, IconRestore } from '@tabler/icons-react';

import { invalidateUserData, useUserData } from '../_ctx/userData';
import { useUser } from '@/app/_ctx/user/context';
import { graphAuth, graphError, graphql } from '@/query/graphql';
import { notifications } from '@mantine/notifications';
import { invalidateUser } from '@/app/_ctx/user/actions';
import fdeq from 'fast-deep-equal';
import { z } from 'zod';

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
      const f = await graphAuth(
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
          message: graphError((err as any).response),
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

          <div className=" flex flex-col gap-4 rounded-lg sm:flex-row sm:items-center">
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
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default AccountDetails;
