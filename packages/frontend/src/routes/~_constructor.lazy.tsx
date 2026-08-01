import useSize from '@react-hook/size';
import { type RefObject, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Flex, Group } from '@vkontakte/vkui';
import { createLazyFileRoute, Outlet } from '@tanstack/react-router';
import { SkinViewerLazy, type SkinViewerProps } from '@skinner/skinviewer';

import { Panel } from './__root/components';
import { Sections } from './~_constructor/components';

import { useSession } from '../models';
import {
  ConstructorEditorProvider,
  ConstructorGridProvider,
  ConstructorServiceProvider,
  useConstructorServiceProvider,
} from './~_constructor/models';

import styles from './~_constructor/index.module.css';

const Constructor = observer(() => {
  const { user } = useSession();
  const model = useConstructorServiceProvider();

  const inRef = useRef<HTMLDivElement>(null);
  const skinRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Required<SkinViewerProps>['getRef']['current']>(null);

  model.viewer = viewerRef.current;

  const [width, height] = useSize<HTMLDivElement>(inRef as RefObject<HTMLDivElement>);

  return (
    <>
      <Panel className={styles.root}>
        <Group className={styles.group} mode="card">
          <Flex getRootRef={inRef} className={styles.in} noWrap>
            <Flex.Item className={styles.skin}>
              <SkinViewerLazy
                getRef={viewerRef}
                getRootRef={skinRef}
                width={width / 2.5}
                height={height}
                skin={user?.minecraft_active_skin?.url}
                enablePan
                enableZoom
                enableRotate
              />
            </Flex.Item>
            <Flex.Item className={styles.sections} flex="content">
              <Flex className={styles.sectionsIn} direction="column" noWrap>
                <Sections />
              </Flex>
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
      <ConstructorGridProvider>
        <ConstructorEditorProvider>
          <Constructor />
        </ConstructorEditorProvider>
      </ConstructorGridProvider>
    </ConstructorServiceProvider>
  ),
});
