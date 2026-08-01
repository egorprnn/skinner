/* lock-restricted-props: {"VKUIImage":["@vkontakte/vkui",{"style":1}]} */
import { Image as VKUIImage, type ImageProps as VKUIImageProps } from '@vkontakte/vkui';

export interface ImageProps extends VKUIImageProps {
  width?: number;
  height?: number;
}

const ImageComponent = ({ size, width, height, style, ...restProps }: ImageProps): JSX.Element => (
  <VKUIImage
    size={Math.min(width ?? 0, height ?? 0) || size}
    style={{ ...style, minWidth: width ?? style?.minWidth, minHeight: height ?? style?.minHeight }}
    {...restProps}
  />
);

export const Image = Object.assign(ImageComponent, VKUIImage);
