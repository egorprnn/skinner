import { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useMeasure } from '@react-hookz/web';
import { Flex, Group } from '@vkontakte/vkui';
import { SkinViewerLazy } from '@skinner/skinviewer';
import { createLazyFileRoute, Outlet } from '@tanstack/react-router';

import { Panel } from './__root/components';
import { Sections } from './~_constructor/components';

import { useSession } from '../models';
import { ConstructorServiceProvider } from './~_constructor/models';

import styles from './~_constructor/index.module.css';

const Constructor = observer(() => {
  const { user } = useSession();

  const skinRef = useRef<HTMLDivElement>(null);

  const [measures, inRef] = useMeasure<HTMLDivElement>();

  return (
    <>
      <Panel className={styles.root}>
        <Group getRootRef={inRef} className={styles.in} mode="card">
          <Flex gap="xl" noWrap>
            <Flex.Item className={styles.skin}>
              <SkinViewerLazy
                getRootRef={skinRef}
                width={(measures?.width ?? 0) / 2.5}
                height={measures?.height ?? 0}
                skin={user?.minecraft_active_skin?.url}
                enablePan
                enableZoom
                enableRotate
              />
            </Flex.Item>
            <Flex.Item className={styles.sections}>
              <Sections />
            </Flex.Item>
          </Flex>
        </Group>
      </Panel>
      <Outlet />
    </>
  );
});
Constructor.displayName = 'Constructor';

export const Route = createLazyFileRoute('/_constructor')({
  component: () => (
    <ConstructorServiceProvider>
      <Constructor />
    </ConstructorServiceProvider>
  ),
});
