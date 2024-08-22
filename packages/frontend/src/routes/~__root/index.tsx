import { LazyMotion } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AdaptivityProvider, AppRoot, ConfigProvider, PanelHeader, SplitCol, SplitLayout } from '@vkontakte/vkui';

import { Sidebar } from './components';

import { SessionProvider } from '../../models';

import { loadFramerMotionFeatures } from './framerMotion';

import styles from './index.module.css';

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

export const Route = createRootRoute({
  component: Root,
  wrapInSuspense: true,
  pendingComponent: RootSkeleton,
});
