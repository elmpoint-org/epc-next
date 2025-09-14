import { Switch, SwitchProps } from '@mantine/core';

export default function OptionSwitch({ ...props }: SwitchProps) {
  return (
    <>
      <Switch
        {...props}
        classNames={{
          input: 'peer',
          track:
            'not-peer-checked:border-slate-300 not-peer-checked:bg-slate-300',
          thumb: 'border-0',
          body: 'items-center',
        }}
      />
    </>
  );
}
