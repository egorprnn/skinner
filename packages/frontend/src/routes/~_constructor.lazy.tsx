import { useRef } from 'react';
import { Group } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import { useMeasure } from '@react-hookz/web';
import { SkinViewerLazy } from '@skinner/skinviewer';
import { createLazyFileRoute, Outlet } from '@tanstack/react-router';

import { Panel } from './~__root/components';

import { useSession } from '../services';

import styles from './~_constructor/index.module.css';

const Constructor = observer(() => {
  const { user } = useSession();

  const skinRef = useRef<HTMLDivElement>(null);

  const [measures, inRef] = useMeasure<HTMLDivElement>();

  return (
    <Panel className={styles.root}>
      <Group getRootRef={inRef} className={styles.in} mode="card">
        <SkinViewerLazy
          getRootRef={skinRef}
          className={styles.skin}
          width={(measures?.width ?? 0) / 2.5}
          height={measures?.height ?? 0}
          skin={user?.minecraft_active_skin?.url}
          enablePan
          enableZoom
          enableRotate
        />
        {/*<Sections />*/}
      </Group>
      <Outlet />
    </Panel>
  );
});
Constructor.displayName = 'Constructor';

export const Route = createLazyFileRoute('/_constructor')({
  component: Constructor,
  notFoundComponent: () => <>test</>,
});
