import type { Meta } from '@storybook/react';
import { Spacing } from '@vkontakte/vkui';
import { ImageBase, type ImageBaseProps } from './ImageBase';

const story: Meta<ImageBaseProps> = {
  id: 'ImageBase',
  title: 'Adopted VKUI/ImageBase',
  component: ImageBase,
  args: {
    src: 'https://sun9-27.userapi.com/c82XkokknIsAnczN7dVGHEo7KHgagVdci6jzwg/WKEsTmfpwuQ.jpg',
  },
};

export default story;

export const Base = (props: ImageBaseProps): JSX.Element => (
  <>
    <ImageBase {...props} />
    <Spacing size={8} />
    <ImageBase {...props} widthSize={200} heightSize={300} />
    <Spacing size={8} />
    <ImageBase {...props} widthSize={300} heightSize={200} />
  </>
);
