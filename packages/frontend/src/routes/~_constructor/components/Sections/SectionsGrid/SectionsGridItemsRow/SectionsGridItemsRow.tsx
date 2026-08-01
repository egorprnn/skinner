import { SimpleGrid } from '@vkontakte/vkui';
import { forwardRef, type HTMLAttributes } from 'react';
import type { VirtualItem } from '@tanstack/react-virtual';

import { SectionsGridCard } from '../SectionsGridCard';

import {
  type ConstructorGridItemsRow,
  useConstructorEditorProvider,
  useConstructorGridProvider,
} from '../../../../models';

import styles from './SectionsGridItemsRow.module.css';
import { observer } from 'mobx-react-lite';

export interface SectionsGridItemsRowProps extends VirtualItem, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {}

export const SectionsGridItemsRow = observer(
  forwardRef<HTMLDivElement, SectionsGridItemsRowProps>(({ index, ...restProps }: SectionsGridItemsRowProps, ref) => {
    const grid = useConstructorGridProvider();
    const editor = useConstructorEditorProvider();

    const { items } = grid.items[index] as ConstructorGridItemsRow;

    return (
      <SimpleGrid getRootRef={ref} className={styles.root} gap="l" columns={grid.ITEMS_ROW_COLUMNS} {...restProps}>
        {items.map((item) => {
          const { id, url } = item;

          return (
            <SectionsGridCard
              key={id}
              src={url}
              activated={editor.hasStackItem(item) || undefined}
              onClick={() => {
                editor.toggleStackItem(item);
              }}
            />
          );
        })}
      </SimpleGrid>
    );
  }),
);
SectionsGridItemsRow.displayName = 'SectionsGridItemsRow';
