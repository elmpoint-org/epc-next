import { ReverseCbProp, useReverseCb } from '@/util/reverseCb';
import { useFormCtx } from '../state/formCtx';
import { notifications } from '@mantine/notifications';

export default function FormSubmit({
  trigger: onSubmit,
}: {
  trigger: ReverseCbProp;
}) {
  const { dates, eventText, guests } = useFormCtx();

  useReverseCb(onSubmit, () => {
    // ready for submission
    notifications.show({ message: `i'm going to submit now` });
  });

  return null;
}
