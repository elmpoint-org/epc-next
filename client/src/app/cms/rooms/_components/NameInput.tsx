import { CloseButton, TextInput, TextInputProps } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { ForwardedRef, forwardRef } from 'react';

const NameInput = forwardRef<HTMLInputElement, NameInputProps>((p, r) => (
  <NameInputComponent {...p} ref={r} />
));
NameInput.displayName = 'NameInput';
export default NameInput;

type NameInputProps = {
  onUpdate?: (s: string) => void;
  onDelete?: () => void;
  value: string;
  ref: ForwardedRef<HTMLInputElement>;
} & TextInputProps;

// COMPONENT
function NameInputComponent({
  onUpdate,
  onDelete,
  onChange,
  rightSection: _,
  ...props
}: NameInputProps) {
  const { value } = props;
  return (
    <>
      <TextInput
        {...props}
        onChange={(e) => {
          onUpdate?.(e.currentTarget.value);
          onChange?.(e);
        }}
        rightSection={
          <CloseButton
            icon={
              value.length ? undefined : <IconTrash size={20} stroke={1.5} />
            }
            onClick={() => {
              if (value.length) onUpdate?.('');
              else onDelete?.();
            }}
          />
        }
      />
    </>
  );
}
