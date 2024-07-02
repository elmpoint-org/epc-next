'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

import { useSkeleton } from '@/app/_ctx/skeleton/context';
import { graphAuth, graphql } from '@/query/graphql';
import { clx } from '@/util/classConcat';

export default function DeletePage({ pageId }: { pageId: string }) {
  const router = useRouter();

  async function confirmLogout() {
    const a = await confirmDeleteModal();
    if (!a) return;
    deletePage();
  }

  const [isLoading, loading] = useTransition();
  function deletePage() {
    loading(async () => {
      // send delete request
      const f = await graphAuth(
        graphql(`
          mutation CmsPageDelete($id: ID!) {
            cmsPageDelete(id: $id) {
              id
            }
          }
        `),
        { id: pageId },
      ).catch(() => {
        notifications.show({
          color: 'red',
          message: 'Request failed. Try again.',
        });
        return false;
      });
      if (!f) return;
      notifications.show({ message: 'Successfully deleted!' });
      router.push('/cms/pages');
    });
  }

  const isSkeleton = useSkeleton();

  return (
    <>
      <div className="mt-36 flex flex-col justify-center gap-4 border-t border-slate-200 py-4 sm:flex-row sm:items-center">
        <Button
          onClick={confirmLogout}
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

async function confirmDeleteModal() {
  return new Promise<boolean>((resolve) =>
    modals.openConfirmModal({
      title: <>Are you sure?</>,
      children: (
        <>
          <div className="mb-4 border-b border-slate-200" />

          <div className="prose prose-sm leading-normal">
            <p>
              Are you sure you want to <b>permanently delete</b> this page?
            </p>
          </div>
          <div className="h-2"></div>
        </>
      ),
      labels: { confirm: 'Permanently delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      classNames: {
        content: clx('rounded-xl p-2'),
      },
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    }),
  );
}
