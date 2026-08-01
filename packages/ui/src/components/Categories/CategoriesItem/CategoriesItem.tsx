import { classNames } from '@vkontakte/vkjs';
import { Tappable, type TappableProps } from '@vkontakte/vkui';

import styles from './CategoriesItem.module.css';

export interface CategoriesItemProps extends TappableProps {}

export const CategoriesItem = ({ className, ...restProps }: CategoriesItemProps) => (
  <Tappable className={classNames(styles.root, className)} {...restProps} />
);
