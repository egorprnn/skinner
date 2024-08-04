import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Button, type ButtonProps } from '@vkontakte/vkui';

import { useSession } from '../../services';

export type AuthButtonProps = Omit<ButtonProps, 'href' | 'loading' | 'disabled' | 'children'>;

export const AuthButton = observer((props: AuthButtonProps) => {
  const { authed, microsoftAuthUrl, isLoginStarted } = useSession();
  const { t } = useTranslation(['common']);

  return (
    <Button {...props} href={microsoftAuthUrl} loading={!microsoftAuthUrl} disabled={authed || isLoginStarted}>
      {t('common:login')}
    </Button>
  );
});
AuthButton.displayName = 'AuthButton';
