/* lock-restricted-props: {"Group":["Adopted",{"style":1}]} */
import { Meta } from '@storybook/react';
import { Icon56ArrowUpRectangleOutline } from '@vkontakte/icons';
import { createAnnotations } from '@vkontakte-internal/storybook';
import { JSX } from 'react';
import { getColorClass } from '../../../utils';
import { Button, Group, Placeholder, Spacing } from '../../Adopted';
import { Grid } from '../../Grid';
import { DragAndDropInput, DragAndDropInputProps } from './DragAndDropInput';

const story: Meta<DragAndDropInputProps> = {
  id: 'DragAndDropInput',
  title: 'forms/DragAndDropInput',
  component: DragAndDropInput,
  tags: ['загрузка', 'файлы', 'ввод', 'upload', 'input', 'file'],
  args: {
    onChange: console.log,
    enableInteractive: true,
  },
  ...createAnnotations({
    parameters: {
      padded: true,
      figmaUrl: 'https://www.figma.com/file/LH8icrZrxLJWqg7xpb0Qmb/VKCOM-Core?type=design&node-id=1220-209628',
    },
  }),
};

export default story;

export const Base = (props: DragAndDropInputProps): JSX.Element => {
  return (
    <Group>
      <DragAndDropInput {...props}>
        <Placeholder icon={<Icon56ArrowUpRectangleOutline />} header="Загрузить файл">
          Нажмите на область загрузки, либо переместите файл в нее.
        </Placeholder>
      </DragAndDropInput>
      <Spacing />
      <DragAndDropInput {...props}>
        {({ active }) => (
          <Placeholder
            icon={<Icon56ArrowUpRectangleOutline className={getColorClass(active ? 'color_icon_accent' : undefined)} />}
            header="Загрузить файл"
            action={<Button onClick={() => alert('Нажали на кнопку')}>Кнопка</Button>}
          >
            {active
              ? 'Файл находится в области загрузки'
              : 'Контент компонента может изменяться при перемещении файла в область.'}
          </Placeholder>
        )}
      </DragAndDropInput>
    </Group>
  );
};

export const Overlay = (props: DragAndDropInputProps): JSX.Element => {
  return (
    <Group style={{ height: '50%' }}>
      Начните переносить файлы в область просмотра
      <DragAndDropInput {...props} overlay>
        <Placeholder icon={<Icon56ArrowUpRectangleOutline />} header="Загрузить файл" stretched>
          Нажмите на область загрузки, либо переместите файл в нее.
        </Placeholder>
      </DragAndDropInput>
    </Group>
  );
};

export const Stretched = (props: DragAndDropInputProps): JSX.Element => (
  <Grid columns={1} spacing={8} stretched>
    <Grid.Item>
      <DragAndDropInput {...props} stretched>
        <Placeholder stretched> Нажмите на область загрузки, либо переместите файл в нее.</Placeholder>
      </DragAndDropInput>
    </Grid.Item>
    <Grid.Item>
      <DragAndDropInput {...props} stretched>
        <Placeholder stretched> Нажмите на область загрузки, либо переместите файл в нее.</Placeholder>
      </DragAndDropInput>
    </Grid.Item>
  </Grid>
);
