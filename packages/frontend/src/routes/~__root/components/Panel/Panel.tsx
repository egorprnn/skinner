import {
  Panel as PanelBase,
  PanelHeader,
  type PanelHeaderProps,
  type PanelProps as PanelBaseProps,
} from '@vkontakte/vkui';

import { PanelUser } from './PanelUser';
import { PanelAuthButton } from './PanelAuthButton';

export interface PanelProps extends PanelBaseProps {
  header?: PanelHeaderProps['children'];
}

export const Panel = ({ header, children, ...props }: PanelProps) => (
  <PanelBase {...props}>
    <PanelHeader
      after={
        <>
          <PanelUser key="header-user" />
          <PanelAuthButton key="auth-button" />
        </>
      }
    >
      {header}
    </PanelHeader>
    {children}
  </PanelBase>
);
