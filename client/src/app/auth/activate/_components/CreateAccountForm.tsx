'use client';

import { Button, Fieldset, TextInput } from '@mantine/core';
import { FormEvent, useState } from 'react';

export default function CreateAccountForm({
  preUser,
}: {
  preUser: { email: string; name: string | null; id: string };
}) {
  const [email, setEmail] = useState(preUser.email);
  const [name, setName] = useState(preUser.name ?? '');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="relative">
        <Fieldset className="space-y-4 rounded-lg">
          <div className="border-b border-slate-300 py-2 text-sm">
            Make sure your account details are right before your account is
            created.
          </div>

          <TextInput
            label="Name"
            description="Make sure your full name is correct here."
            placeholder="Enter your name"
            required
            type="text"
            value={name}
            onChange={({ currentTarget: { value: v } }) => setName(v)}
          />
          <TextInput
            label="Email"
            description="You can use any email you’d like for your account, even if it’s not the one you were invited with."
            placeholder="Enter your email"
            required
            type="email"
            value={email}
            onChange={({ currentTarget: { value: v } }) => setEmail(v)}
          />

          <Button type="submit" className="w-full">
            Create your account
          </Button>
        </Fieldset>

        {/* {verifyFn.isPending && <LoadingBlurFrame />} */}
      </form>
    </>
  );
}
