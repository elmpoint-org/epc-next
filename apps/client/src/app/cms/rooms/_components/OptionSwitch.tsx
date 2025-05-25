import { Switch, SwitchProps } from '@mantine/core';

export default function OptionSwitch({ ...props }: SwitchProps) {
  return (
    <>
      <Switch
        {...props}
        classNames={{
          input: 'peer',
          track:
            '[.peer:not(:checked)~&]:border-slate-300 [.peer:not(:checked)~&]:bg-slate-300',
          thumb: 'border-0',
          body: 'items-center',
        }}
      />
    </>
  );
}
