import { Checkbox as MantineCheckbox } from '@mantine/core';

export default function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <>
      <MantineCheckbox
        checked={checked}
        onChange={({ currentTarget: { checked: v } }) => onChange(v)}
        classNames={{
          icon: 'group-hover:transform-none group-hover:text-dgreen/80 group-hover:opacity-100 group-hover:group-data-[s]:text-dwhite group-hover:group-data-[s]:opacity-50',
        }}
      />
    </>
  );
}
