import useSize from '@react-hook/size';
import { useDebounce } from 'react-use';
import { classNames } from '@vkontakte/vkjs';
import { Image, type ImageProps } from '@vkontakte/vkui';
import { type RefObject, useEffect, useRef, useState } from 'react';
import { useSkinRenderer, SkinRendererPosition } from '@skinner/skinviewer';

import styles from './SectionGridCardImage.module.css';

export interface SectionGridCardImageProps extends ImageProps {}

export const SectionGridCardImage = ({ src, className, ...restProps }: SectionGridCardImageProps) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageWidth, imageHeight] = useSize<HTMLDivElement>(imageRef as RefObject<HTMLDivElement>);

  const [width, setWidth] = useState(imageWidth);
  const [height, setHeight] = useState(imageHeight);

  useDebounce(
    () => {
      setWidth(imageWidth);
      setHeight(imageHeight);
    },
    1_000,
    [imageWidth, imageHeight],
  );

  const { ref: renderRef, render } = useSkinRenderer({
    skin: src,
    width,
    height,
    position: SkinRendererPosition.BODY,
  });

  useEffect(() => {
    renderRef.current = imageRef.current?.parentElement ?? null;
  }, []);

  return <Image getRootRef={imageRef} className={classNames(styles.root, className)} src={render} {...restProps} />;
};
