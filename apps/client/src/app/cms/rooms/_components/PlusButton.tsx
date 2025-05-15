import { forwardRef } from 'react';

import { Button, ButtonProps } from '@mantine/core';
import { IconLoader2, IconPlus } from '@tabler/icons-react';

type Props = Omit<JSX.IntrinsicElements['button'], 'ref'> & ButtonProps;

const PlusButton = forwardRef<HTMLButtonElement, Props>(
  ({ children, loading, ...props }, r) => {
    return (
      <>
        <Button
          ref={r}
          size="compact"
          justify="center"
          variant="light"
          leftSection={
            loading ? (
              <>
                <div className="flex flex-col justify-center">
                  <IconLoader2 className="size-4 animate-spin" />
                </div>
              </>
            ) : (
              <IconPlus className="size-4" />
            )
          }
          {...props}
        >
          {children}
        </Button>
      </>
    );
  },
);
PlusButton.displayName = 'PlusButton';

export default PlusButton;
