import { Button } from '@mantine/core';
import { useFormCtx } from '../state/formCtx';
import { confirmModal } from '@/app/_components/_base/modals';
import { graphAuth, graphql } from '@/query/graphql';
import { notifications } from '@mantine/notifications';
import { useInvalidate } from '../../_components/ViewEvents';
import { useCloseFloatingWindow } from '@/app/_components/_base/FloatingWindow';
import { useTransition } from 'react';

export default function FormDelete() {
  // get stay id
  const { updateId } = useFormCtx();

  // control final state
  const invalidate = useInvalidate();
  const closeDialog = useCloseFloatingWindow();

  const [isLoading, loading] = useTransition();

  async function handleDelete() {
    if (!updateId?.length) return;

    const yes = await confirmDeleteModal();
    if (!yes) return;

    loading(async () => {
      const { errors, data } = await graphAuth(
        graphql(`
          mutation StayDelete($id: ID!) {
            stayDelete(id: $id) {
              id
            }
          }
        `),
        { id: updateId },
      );
      if (errors || !data?.stayDelete) {
        notifications.show({
          color: 'red',
          message: 'An error occurred.',
        });
        return console.log(errors?.[0].code ?? errors);
      }

      invalidate?.();
      closeDialog?.();
    });
  }

  return (
    <>
      <div>
        {updateId?.length && (
          <Button color="red" loading={isLoading} onClick={handleDelete}>
            Delete Stay
          </Button>
        )}
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
          Are you sure you want to <b>permanently delete</b> this event?
        </p>
      </>
    ),
    buttons: { confirm: 'Permanently delete' },
  });
}
