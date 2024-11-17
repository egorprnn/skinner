import { classNames } from '@vkontakte/vkjs';
import {
  Cell,
  Panel,
  Group,
  Button,
  SplitCol,
  PanelHeader,
  FixedLayout,
  useAdaptivityConditionalRender,
} from '@vkontakte/vkui';
import styles from './Sidebar.module.css';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from '@tanstack/react-router';

const SIDEBAR_TABS = [
  {
    icon: null,
    title: 'sidebar:tab_constructor',
    path: '/constructor',
  },
] as const;

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(['sidebar']);
  const { viewWidth } = useAdaptivityConditionalRender();

  if (!viewWidth.tabletPlus) {
    return null;
  }

  return (
    <SplitCol
      className={classNames(viewWidth.tabletPlus.className, styles.root)}
      minWidth={280}
      width={280}
      maxWidth={280}
      autoSpaced
      fixed
    >
      <Panel>
        <PanelHeader
          before={
            <div
              style={{
                width: 50,
                height: 50,
                background: 'rgb(0, 119, 255)',
              }}
            />
          }
        />
        <Group>
          {SIDEBAR_TABS.map(({ icon, title, path }) => (
            <Cell
              key={path}
              before={icon}
              activated={location.pathname.startsWith(path)}
              onClick={() =>
                navigate({
                  to: path,
                })
              }
            >
              {t(title)}
            </Cell>
          ))}
        </Group>
        <FixedLayout vertical="bottom">
          <Group>
            <Button size="m" mode="secondary" stretched>
              Discord
            </Button>
          </Group>
        </FixedLayout>
      </Panel>
    </SplitCol>
  );
};
