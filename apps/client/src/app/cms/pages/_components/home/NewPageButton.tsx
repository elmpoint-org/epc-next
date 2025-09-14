'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';

import { oldGraphAuth } from '@/query/graphql';
import { useUser } from '@/app/_ctx/user/context';
import { NEW_CMS_PAGE_KEY } from '@/app/cms/_util/queries';

export default function NewPageButton() {
  const user = useUser();
  const router = useRouter();
  const [isLoading, loading] = useTransition();

  function createPage() {
    loading(async () => {
      const data = await oldGraphAuth(...NEW_CMS_PAGE_KEY(user?.id)).catch(
        () => {
          notifications.show({ message: 'An error occurred.' });
        },
      );
      if (!data?.cmsPageCreate) return;

      notifications.show({ message: 'Successfully created.' });
      router.push(`/cms/pages/edit/${data.cmsPageCreate.id}`);
    });
  }

  return (
    <>
      <ActionIcon
        onClick={createPage}
        loading={isLoading}
        color="slate"
        variant="light"
        size="sm"
      >
        <IconPlus />
      </ActionIcon>
    </>
  );
}
