import { forwardRef } from 'react';

import { ActionIcon, type ActionIconProps } from '@mantine/core';
import type { IconProps, Icon } from '@tabler/icons-react';

type IconType = React.ForwardRefExoticComponent<
  Omit<IconProps, 'ref'> & React.RefAttributes<Icon>
>;

type ActionButtonProps = {
  Icon: IconType;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
} & ActionIconProps;

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ Icon, onClick, ...props }, ref) => {
    return (
      <>
        <ActionIcon
          onClick={onClick}
          size="sm"
          variant="transparent"
          color="black"
          ref={ref}
          {...props}
        >
          <Icon stroke={1} className="h-5" />
        </ActionIcon>
      </>
    );
  },
);
ActionButton.displayName = 'ActionButton';

export default ActionButton;
