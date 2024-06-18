import { observer } from 'mobx-react-lite';
import { Image, SimpleCell } from '@vkontakte/vkui';
import { MinecraftAvatar } from '@skinner/skinviewer';

import { useSession } from '../../../../../store';

import styles from './PanelUser.module.css';

export const PanelUser = observer(() => {
  const { authed, user } = useSession();

  if (!authed || !user) {
    return null;
  }

  const { name, minecraft_active_skin } = user;

  return (
    <SimpleCell
      after={
        minecraft_active_skin && (
          <Image size={36} noBorder>
            <MinecraftAvatar url={minecraft_active_skin.url} />
          </Image>
        )
      }
      activeMode="opacity"
      hoverMode="opacity"
      onClick={() => {}}
    >
      <span className={styles['name']}>{name}</span>
    </SimpleCell>
  );
});
PanelUser.displayName = 'HeaderUser';
