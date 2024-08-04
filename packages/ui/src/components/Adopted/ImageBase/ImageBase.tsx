import { classNames } from '@vkontakte/vkjs';
import { ImageBase as VKUIImageBase } from '@vkontakte/vkui';
import type { ComponentProps } from 'react';
import styles from './ImageBase.module.css';

export interface ImageBaseProps extends ComponentProps<typeof VKUIImageBase> {
  /**
   * object-fit изображения
   * TODO (@vkontakte/vkui) [>=6.0.0]: https://github.com/VKCOM/VKUI/issues/6498
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
}

const ImageBaseComponent = ({
  style,
  objectFit,
  className: classNameProp,
  ...restProps
}: ImageBaseProps): JSX.Element => (
  <VKUIImageBase
    className={classNames(classNameProp, objectFit && styles.rootHasObjectFit)}
    style={{
      ...style,
      ...(objectFit ? { '--image-base-object-fit': objectFit } : undefined),
    }}
    {...restProps}
  />
);

export const ImageBase = Object.assign(ImageBaseComponent, VKUIImageBase);
