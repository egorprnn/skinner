export const SKIN_SUPPORTED_SIZES = [64];

export const isSupportedSkinSize = (size: { width: number; height: number } | number) => {
  if (typeof size === 'number') {
    size = {
      width: size,
      height: size,
    };
  }

  const { width, height } = size;

  return SKIN_SUPPORTED_SIZES.includes(width) || SKIN_SUPPORTED_SIZES.includes(height);
};
