import { Div } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';

import { AuthButton } from '../../../../../components';

import { useSession } from '../../../../../store';

export const PanelAuthButton = observer(() => {
  const { authed } = useSession();

  if (authed) {
    return null;
  }

  return (
    <Div>
      <AuthButton mode="secondary" />
    </Div>
  );
});
PanelAuthButton.displayName = 'HeaderAuthButton';
