import { Suspense } from 'react';
import { AspectRatio, Tappable, type TappableProps } from '@vkontakte/vkui';
import { SectionGridCardImage, type SectionGridCardImageProps } from './SectionGridCardImage';

import styles from './SectionsGridCard.module.css';

export interface SectionsGridCardProps extends TappableProps, Pick<SectionGridCardImageProps, 'src'> {}

export const SectionsGridCard = ({ src, ...restProps }: SectionsGridCardProps) => (
  <Tappable {...restProps}>
    <AspectRatio className={styles.in} ratio={1 / 1}>
      <Suspense
        fallback={<SectionGridCardImage className={styles.image} widthSize="100%" heightSize="100%" borderRadius="l" />}
      >
        <SectionGridCardImage className={styles.image} src={src} widthSize="100%" heightSize="100%" borderRadius="l" />
      </Suspense>
    </AspectRatio>
  </Tappable>
);
