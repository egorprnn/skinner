import {
  Button,
  Cell,
  FixedLayout,
  Group,
  Panel,
  PanelHeader,
  SplitCol,
  useAdaptivityConditionalRender,
} from '@vkontakte/vkui';

export const Sidebar = () => {
  const { viewWidth } = useAdaptivityConditionalRender();

  if (!viewWidth.tabletPlus) {
    return null;
  }

  return (
    <SplitCol className={viewWidth.tabletPlus.className} minWidth={280} width={280} maxWidth={280} autoSpaced fixed>
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
          <Cell>modal 1</Cell>
          <Cell>modal 2</Cell>
          <Cell>alert</Cell>
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
