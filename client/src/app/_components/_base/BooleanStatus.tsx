import { IconCheck, IconX } from '@tabler/icons-react';

import type { IconType } from '@/util/iconType';
import { clx } from '@/util/classConcat';

export default function BooleanStatus({
  value,
  className,
}: {
  value: boolean;
  className?: string;
}) {
  const iconProps: Parameters<IconType>[0] = {
    stroke: 1,
  };
  return (
    <>
      <div className={clx(className)} data-true={value || null}>
        {value ? <IconCheck {...iconProps} /> : <IconX {...iconProps} />}
      </div>
    </>
  );
}
