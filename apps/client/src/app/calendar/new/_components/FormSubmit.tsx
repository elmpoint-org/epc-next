import { ReverseCbProp, useReverseCb } from '@/util/reverseCb';
import { useFormActions } from './FormActions';

export default function FormSubmit({
  trigger: onSubmit,
}: {
  trigger: ReverseCbProp;
}) {
  // handle form submission
  const runAction = useFormActions();
  useReverseCb(onSubmit, () => runAction('SUBMIT'));

  return null;
}
