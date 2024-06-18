import { ImageBase } from '@skinner/ui';
import { LazyMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { PropsWithChildren } from 'react';
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

import { session, SessionProvider } from '../../store';

import { loadFramerMotionFeatures } from './framerMotion';

import image404 from '../../../assets/404.png?format=webp';

import '@skinner/ui/themes/vkBaseDark.css';

type RootProps = PropsWithChildren;

function Root({ children = <Outlet /> }: RootProps): JSX.Element {
  return (
    <SessionProvider value={session}>
      <LazyMotion features={loadFramerMotionFeatures}>
        <ConfigProvider platform="android" appearance="dark">
          <AdaptivityProvider>
            <AppRoot>
              <SplitLayout header={<PanelHeader delimiter="none" />}>
                <Sidebar />
                <SplitCol width="100%" stretchedOnMobile autoSpaced>
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

function RootNotFound() {
  const { t } = useTranslation('common');

  return (
    <Panel centered>
      <Group>
        <Div>
          <Placeholder
            icon={<ImageBase size={150} src={image404} objectFit="contain" withTransparentBackground noBorder />}
            header={t('common.not_found_title')}
            action={
              <Button size="m" mode="tertiary">
                {t('common.not_found_go_back')}
              </Button>
            }
            stretched
          >
            {t('common.not_found_description')}
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
