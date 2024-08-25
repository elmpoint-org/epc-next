import { TransitionStartFunction } from 'react';
import { notifications } from '@mantine/notifications';

import { ReverseCbProp, useReverseCb } from '@/util/reverseCb';
import { useFormCtx } from '../state/formCtx';

export default function FormSubmit({
  trigger: onSubmit,
  loading,
}: {
  trigger: ReverseCbProp;
  loading: TransitionStartFunction;
}) {
  const { dates, eventText, guests } = useFormCtx();

  useReverseCb(onSubmit, () => {
    loading(async () => {
      return new Promise((res) =>
        setTimeout(() => {
          res();
          notifications.show({ message: 'done' });
        }, 3000),
      );
    });
  });

  return null;
}
