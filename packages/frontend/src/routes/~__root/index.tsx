import { ImageBase } from '@skinner/ui';
import { LazyMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { PropsWithChildren } from 'react';
import { DIProvider, rootContainer } from '@skinner/di';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import {
  AdaptivityProvider,
  AppRoot,
  Button,
  ConfigProvider,
  Div,
  Group,
  PanelHeader,
  Placeholder,
  SplitCol,
  SplitLayout,
} from '@vkontakte/vkui';

import { Panel, Sidebar } from './components';

import { SessionProvider } from '../../services';

import { loadFramerMotionFeatures } from './framerMotion';

import styles from './index.module.css';

import image404 from '../../../assets/404.png?format=webp';

import '@skinner/ui/themes/vkBaseDark.css';

type RootProps = PropsWithChildren;

function Root({ children = <Outlet /> }: RootProps): JSX.Element {
  return (
    <DIProvider instance={rootContainer}>
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
    </DIProvider>
  );
}

function RootNotFound() {
  const { t } = useTranslation();

  return (
    <Panel centered>
      <Group>
        <Div>
          <Placeholder
            icon={<ImageBase size={150} src={image404} objectFit="contain" withTransparentBackground noBorder />}
            header={t('common:not_found_title')}
            action={
              <Button size="m" mode="tertiary">
                {t('common:not_found_go_back')}
              </Button>
            }
            stretched
          >
            {t('common:not_found_description')}
          </Placeholder>
        </Div>
      </Group>
    </Panel>
  );
}

function RootSkeleton() {
  return (
    <AppRoot>
      <SplitLayout header={<PanelHeader delimiter="none" />} />
    </AppRoot>
  );
}

export const Route = createRootRoute({
  component: Root,
  wrapInSuspense: true,
  pendingComponent: RootSkeleton,
  notFoundComponent: RootNotFound,
});
