'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { useSkeleton } from '@/app/_ctx/skeleton/context';
import { oldGraphAuth, graphql, graphAuth } from '@/query/graphql';
import { clx } from '@/util/classConcat';
import { confirmModal } from '@/app/_components/_base/modals';
import type { EditFormProps } from './PageEditForm';
import { prettyError } from '@/util/prettyErrors';

export default function DeletePage({ pageId }: EditFormProps) {
  const router = useRouter();

  async function confirmDelete() {
    const yes = await confirmDeleteModal();
    if (yes) deletePage();
  }

  const [isLoading, loading] = useTransition();
  function deletePage() {
    loading(async () => {
      // send delete request
      const { errors } = await graphAuth(
        graphql(`
          mutation CmsPageDelete($id: ID!) {
            cmsPageDelete(id: $id) {
              id
            }
          }
        `),
        { id: pageId },
      );
      if (errors) {
        notifications.show({
          color: 'red',
          message: prettyError(
            {
              __DEFAULT: 'Unknown error.',
            },
            (s) => `Error: ${s}`,
          )(errors?.[0]?.code),
        });

        return;
      }
      notifications.show({ message: 'Successfully deleted!' });
      router.push('/cms/pages');
    });
  }

  const isSkeleton = useSkeleton();

  return (
    <>
      <div className="mt-36 flex flex-col justify-center gap-4 border-t border-slate-200 py-4 sm:flex-row sm:items-center">
        <Button
          onClick={confirmDelete}
          loading={isLoading}
          color="red"
          className={clx(
            'flex-shrink-0',
            /* skeleton */ 'disabled:animate-pulse disabled:select-none disabled:bg-slate-200 disabled:text-transparent',
          )}
          disabled={isSkeleton}
        >
          Delete this page
        </Button>
        <div
          className={clx(
            'text-sm text-slate-600',
            /* skeleton */ 'data-[s]:animate-pulse data-[s]:rounded-full data-[s]:bg-slate-200 data-[s]:text-transparent',
          )}
          data-s={isSkeleton || null}
        >
          Click to permanently delete this page.
        </div>
      </div>
    </>
  );
}

function confirmDeleteModal() {
  return confirmModal({
    color: 'red',
    title: <>Are you sure?</>,
    body: (
      <>
        <p>
          Are you sure you want to <b>permanently delete</b> this page?
        </p>
        <p>
          You can always unpublish the page if you just want to make it
          temporarily inaccessible.
        </p>
      </>
    ),
    buttons: { confirm: 'Permanently delete' },
  });
}
