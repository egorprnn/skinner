import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '@vkontakte/vkjs';
import { Children, cloneElement, type CSSProperties, isValidElement, type ReactElement } from 'react';

import { CategoriesItem, type CategoriesItemProps } from './CategoriesItem';
import { CategoriesLevelProvider, useCategoriesLevelContext } from './CategoriesContext';

import styles from './Categories.module.css';

export interface CategoriesProps extends HTMLAttributes<HTMLDivElement> {
  children:
    | ReactElement<CategoriesProps>
    | ReactElement<CategoriesItemProps>
    | Array<ReactElement<CategoriesItemProps>>;
  /**
   * Размер компонента
   */
  size?: CSSProperties['width'];
  /**
   * Сегмент на котором будет располагаться контента компонента в градусах
   */
  segment?: number;
  /**
   * Количество градусов для смещения начала отображения контента
   */
  rotation?: number;
}

export const Categories = ({
  size,
  segment = 0,
  rotation = 0,
  className,
  style,
  children,
  ...restProps
}: CategoriesProps) => {
  const level = useCategoriesLevelContext();

  const { items, subcategories } = Children.toArray(children).reduce<{
    items: ReactNode[];
    subcategories: ReactNode[];
  }>(
    (children, child) => {
      if (isValidElement<CategoriesItemProps>(child) && child.type === CategoriesItem) {
        children.items.push(
          cloneElement(child, {
            style: {
              '--vkui_internal--categories-index': children.items.length,
            },
          }),
        );
      } else {
        children.subcategories.push(child);
      }

      return children;
    },
    {
      items: [],
      subcategories: [],
    },
  );

  return (
    <CategoriesLevelProvider value={level}>
      <div
        className={classNames(styles.root, className)}
        style={{
          ...style,
          '--vkui_internal--categories-level': level,
          '--vkui_internal--categories-count': items.length,
          '--vkui_internal--categories-size': typeof size === 'number' ? `${size}px` : size,
          '--vkui_internal--categories-segment': level === 1 ? `${segment}deg` : undefined,
          '--vkui_internal--categories-rotation':
            level === 1 ? (rotation !== undefined ? `${rotation}deg` : undefined) : undefined,
        }}
        {...restProps}
      >
        {items}
        {subcategories}
      </div>
    </CategoriesLevelProvider>
  );
};
Categories.Item = CategoriesItem;
