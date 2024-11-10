import { classNames } from '@vkontakte/vkjs';
import { type Ref, type SVGProps, useEffect } from 'react';

import { AvatarRenderer } from '../../utils';

export interface MinecraftAvatarProps extends SVGProps<SVGSVGElement> {
  getRootRef?: Ref<SVGSVGElement>;
  url: string;
  size?: number | string;
  title?: string;
}

export const MinecraftAvatar = ({
  getRootRef,
  url,
  size = '100%',
  title,
  className,
  style,
  ...restProps
}: MinecraftAvatarProps): JSX.Element => {
  useEffect(() => AvatarRenderer.render(url), [url]);

  return (
    <svg
      ref={getRootRef}
      width={size}
      height={size}
      aria-hidden="true"
      display="block"
      className={classNames('vkuiIcon', `vkuiIcon--${size}`, `vkuiIcon--w-${size}`, `vkuiIcon--h-${size}`, className)}
      style={{
        ...style,
        borderRadius: style?.borderRadius ?? 'inherit',
      }}
      {...restProps}
    >
      <use xlinkHref={`#${btoa(url)}`}>{title && <title>{title}</title>}</use>
    </svg>
  );
};
