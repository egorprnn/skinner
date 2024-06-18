import { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useMeasure } from '@react-hookz/web';
import { SkinViewer } from '@skinner/skinviewer';
import { createLazyFileRoute } from '@tanstack/react-router';

import { Panel } from '../~__root/components';

import { useSession } from '../../store';

import styles from './index.module.css';

const Constructor = observer(() => {
  const { user } = useSession();

  const skinViewerRef = useRef<HTMLDivElement>(null);

  const [measures, panelRef] = useMeasure<HTMLDivElement>();

  return (
    <Panel getRootRef={panelRef} centered>
      {measures && (
        <SkinViewer
          getRootRef={skinViewerRef}
          className={styles.skinViewer}
          width={measures.width / 2}
          height={measures.height - 100}
          skin={user?.minecraft_active_skin?.url}
          enablePan
          enableRotate
          enableZoom
        />
      )}
    </Panel>
  );
});
Constructor.displayName = 'Constructor';

export const Route = createLazyFileRoute('/constructor/')({
  component: Constructor,
});
