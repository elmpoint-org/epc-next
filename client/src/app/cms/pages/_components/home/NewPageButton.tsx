'use client';

import { useTransition } from 'react';

import { ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';

import { graphAuth } from '@/query/graphql';
import { useUser } from '@/app/_ctx/user/context';
import { revalidatePagesList } from './PagesContainer';
import { NEW_CMS_PAGE_KEY } from '@/app/cms/_util/queries';

export default function NewPageButton() {
  const user = useUser();

  const [isLoading, loading] = useTransition();
  function createPage() {
    loading(async () => {
      const data = await graphAuth(...NEW_CMS_PAGE_KEY(user?.id)).catch(() => {
        notifications.show({ message: 'An error occurred.' });
      });
      if (!data?.cmsPageCreate) return;

      revalidatePagesList();
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
