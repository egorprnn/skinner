import { AnimatePresence, m } from 'framer-motion';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Group, Placeholder, Spinner } from '@vkontakte/vkui';
import { createLazyFileRoute } from '@tanstack/react-router';

import { useSession } from '../../../models';

import { Panel } from '../../__root/components';

const ConnectionsMicrosoft = observer(() => {
  const session = useSession();
  const { t } = useTranslation('connections.microsoft');

  useEffect(() => {
    session.handleMicrosoftCode();
  }, []);

  return (
    <Panel centered>
      <AnimatePresence mode="wait">
        <m.div
          layout
          animate={{ height: 'fit-content', width: 'fit-content' }}
          transition={{
            type: 'tween',
            ease: 'backOut',
            duration: 0.45,
          }}
        >
          {session.isLoginError && (
            <Group>
              <Placeholder title={t('connections.microsoft:error_title')}>
                {t(`connections.microsoft:error_${session.isLoginError}`) || t(`connections.microsoft:error_unknown`)}
              </Placeholder>
            </Group>
          )}
          {!session.isLoginError && <Spinner size="l" />}
        </m.div>
      </AnimatePresence>
    </Panel>
  );
});
ConnectionsMicrosoft.displayName = 'ConnectionsMicrosoft';

export const Route = createLazyFileRoute('/connections/microsoft/')({
  component: ConnectionsMicrosoft,
});
