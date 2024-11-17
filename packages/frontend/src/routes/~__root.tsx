import { LazyMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { PropsWithChildren } from 'react';
import { createRootRoute, Outlet, type ErrorComponentProps } from '@tanstack/react-router';
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  Div,
  Group,
  PanelHeader,
  Placeholder,
  SplitCol,
  SplitLayout,
} from '@vkontakte/vkui';

import { Panel, Sidebar } from './__root/components';

import { SessionProvider } from '../models';

import { loadFramerMotionFeatures } from './__root/framerMotion';

import styles from './__root/index.module.css';

import '@skinner/ui/themes/vkBaseDark.css';

type RootProps = PropsWithChildren;

function Root({ children = <Outlet /> }: RootProps): JSX.Element {
  return (
    <SessionProvider>
      <LazyMotion features={loadFramerMotionFeatures}>
        <ConfigProvider platform="android" appearance="dark">
          <AdaptivityProvider>
            <AppRoot>
              <SplitLayout header={<PanelHeader delimiter="none" />}>
                <Sidebar />
                <SplitCol className={styles.root} width="100%" stretchedOnMobile autoSpaced>
                  {children}
                </SplitCol>
              </SplitLayout>
            </AppRoot>
          </AdaptivityProvider>
        </ConfigProvider>
      </LazyMotion>
    </SessionProvider>
  );
}

function RootSkeleton() {
  return (
    <AppRoot>
      <SplitLayout header={<PanelHeader delimiter="none" />} />
    </AppRoot>
  );
}

function RootError({ error }: ErrorComponentProps) {
  const { t } = useTranslation();

  // todo картинка
  return (
    <Root>
      <Panel centered>
        <Group>
          <Div>
            <Placeholder header={t('common:error_title')}>
              {t('common:error_description')}
              <br />
              <br />
              {String(error)}
            </Placeholder>
          </Div>
        </Group>
      </Panel>
    </Root>
  );
}

export const Route = createRootRoute({
  component: Root,
  wrapInSuspense: true,
  errorComponent: RootError,
  pendingComponent: RootSkeleton,
});
