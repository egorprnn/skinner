import { Panel as PanelBase, PanelHeader, type PanelProps as PanelBaseProps } from '@vkontakte/vkui';

import { PanelUser } from './PanelUser';
import { PanelAuthButton } from './PanelAuthButton';

export type PanelProps = PanelBaseProps;

export const Panel = ({ children, ...props }: PanelProps) => (
  <PanelBase {...props}>
    <PanelHeader
      after={
        <>
          <PanelUser key="header-user" />
          <PanelAuthButton key="auth-button" />
        </>
      }
    />
    {children}
  </PanelBase>
);
