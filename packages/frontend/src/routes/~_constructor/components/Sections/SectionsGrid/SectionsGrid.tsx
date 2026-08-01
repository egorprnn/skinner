import { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { CustomScrollView, Skeleton } from '@vkontakte/vkui';
import { useVirtualizer } from '@tanstack/react-virtual';

import { SectionsGridItemsRow } from './SectionsGridItemsRow';

import { ConstructorGridRowType, useConstructorGridProvider, useConstructorServiceProvider } from '../../../models';

import styles from './SectionsGrid.module.css';

export const SectionsGrid = observer(() => {
  const grid = useConstructorGridProvider();
  const service = useConstructorServiceProvider();

  const customScrollViewRef = useRef<HTMLDivElement>(null);

  const items = grid.items;
  const virtualizer = useVirtualizer({
    overscan: 1,
    count: items.length,
    getScrollElement: () => customScrollViewRef.current,
    estimateSize: () => 0,
    onChange: ({ range }) => {
      console.log(
        range,
        range?.endIndex,
        items.length,
        service.categoriesItemsLoading,
        service.activeCategoryHasMoreItems,
      );

      if (!range || service.categoriesItemsLoading || !service.activeCategoryHasMoreItems) {
        return;
      }

      if (range.endIndex >= items.length - 1) {
        service.fetchCurrentCategoryItems();
      }
    },
  });
  const virtualizerItems = virtualizer.getVirtualItems();

  if (!items.length) {
    return <Skeleton width="100%" height="100%" />;
  }

  return (
    <CustomScrollView getRootRef={customScrollViewRef} className={styles.root}>
      <div
        className={styles.in}
        style={{
          height: virtualizer.getTotalSize(),
        }}
      >
        <div
          className={styles.virtualRows}
          style={{
            transform: `translateY(${virtualizerItems[0]?.start ?? 0}px)`,
          }}
        >
          {virtualizerItems.map(({ key, ...virtualRow }) => {
            const { type } = items[virtualRow.index];

            switch (type) {
              case ConstructorGridRowType.ITEMS:
                return (
                  <SectionsGridItemsRow
                    key={key}
                    ref={virtualizer.measureElement}
                    data-index={virtualRow.index}
                    {...virtualRow}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </CustomScrollView>
  );
});
SectionsGrid.displayName = 'SectionsGrid';
