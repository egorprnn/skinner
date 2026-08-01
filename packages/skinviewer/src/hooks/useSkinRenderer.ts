import { useDebounce } from 'react-use';
import { useMeasure } from '@react-hookz/web';
import { useObjectMemo } from '@skinner/utils';
import { use, useEffect, useState } from 'react';

import { SkinRenderer, type SkinRendererOptions } from '../utils';

export interface UseSkinRendererOptions
  extends Partial<Pick<SkinRendererOptions, 'skin' | 'width' | 'height'>>,
    Omit<SkinRendererOptions, 'skin' | 'width' | 'height' | 'container'> {}

export const useSkinRenderer = (options: UseSkinRendererOptions) => {
  const memoizedOptions = useObjectMemo(options);

  const [measures, ref] = useMeasure<HTMLElement>();
  const containerWidth = measures?.width ?? memoizedOptions.width ?? 0;
  const containerHeight = measures?.height ?? memoizedOptions.height ?? 0;

  const [width, setWidth] = useState(containerWidth);
  const [height, setHeight] = useState(containerHeight);

  useDebounce(
    () => {
      setWidth(containerWidth);
      setHeight(containerHeight);
    },
    1_000,
    [containerWidth, containerHeight],
  );

  const [renderer, setRenderer] = useState<SkinRenderer>();

  useEffect(() => {
    const container = ref.current;
    const renderWidth = memoizedOptions.width ?? width;
    const renderHeight = memoizedOptions.height ?? height;

    if (!memoizedOptions.skin || !renderWidth || !renderHeight || !container) {
      return;
    }

    const renderer = new SkinRenderer({
      ...memoizedOptions,
      container,
      width: renderWidth,
      height: renderHeight,
    } as SkinRendererOptions);

    setRenderer(renderer);

    return () => {
      renderer.destroy();
    };
  }, [memoizedOptions]);

  if (renderer) {
    const render = use(renderer.render());

    return {
      ref,
      render,
    };
  }

  return {
    ref,
  };
};
