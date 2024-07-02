import { useTransition } from 'react';

import { ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import { createNewPage } from '../../_actions/create';
import { revalidatePagesList } from './PagesContainer';

export default function NewPageButton() {
  const [isLoading, loading] = useTransition();
  function createPage() {
    loading(async () => {
      const { data, error } = await createNewPage();
      if (error || !data) {
        notifications.show({ message: 'An error occurred.' });
        return;
      }

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
