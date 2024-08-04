import type { Meta } from '@storybook/react';
import { Spacing } from '@vkontakte/vkui';
import { Image, type ImageProps } from './Image';

const story: Meta<ImageProps> = {
  id: 'Image',
  title: 'Adopted VKUI/Image',
  component: Image,
  args: {
    src: 'https://sun9-27.userapi.com/c82XkokknIsAnczN7dVGHEo7KHgagVdci6jzwg/WKEsTmfpwuQ.jpg',
  },
};

export default story;

export const Base = (props: ImageProps): JSX.Element => (
  <>
    <Image {...props} />
    <Spacing size={8} />
    <Image {...props} width={200} height={300} />
    <Spacing size={8} />
    <Image {...props} width={300} height={200} />
  </>
);
