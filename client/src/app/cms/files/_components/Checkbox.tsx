import { useState } from 'react';

import { Checkbox as MantineCheckbox } from '@mantine/core';

export default function Checkbox() {
  const [enabled, setEnabled] = useState(false);

  return (
    <>
      <MantineCheckbox
        checked={enabled}
        onChange={({ currentTarget: { checked: v } }) => setEnabled(v)}
      />
    </>
  );
}
