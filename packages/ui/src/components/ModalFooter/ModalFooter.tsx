import { classNames } from '@vkontakte/vkjs';
import { Children, cloneElement, type HTMLAttributes, isValidElement, type ReactElement } from 'react';
import {
  Div,
  ViewWidth,
  useAdaptivityWithJSMediaQueries,
  type ButtonProps,
  type ButtonGroupProps,
} from '@vkontakte/vkui';

import styles from './ModalFooter.module.css';

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactElement<ButtonGroupProps>;
}

export const ModalFooter = ({ className, children, ...restProps }: ModalFooterProps) => {
  const { viewWidth } = useAdaptivityWithJSMediaQueries();

  const isTablet = viewWidth > ViewWidth.MOBILE;

  return (
    <Div className={classNames(styles.root, className)} {...restProps}>
      {cloneElement(children, {
        stretched: true,
        children: Children.toArray(children.props.children)
          .filter(isValidElement<ButtonProps>)
          .map((child) =>
            cloneElement(child, {
              size: isTablet ? 'm' : 'l',
              stretched: !isTablet,
            }),
          ),
        ...(isTablet && {
          align: 'right',
        }),
      })}
    </Div>
  );
};
