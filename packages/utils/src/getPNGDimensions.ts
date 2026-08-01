const HEADER_OFFSET = 16;

export function getPNGDimensions(buffer: ArrayBuffer) {
  const dataView = new DataView(buffer);

  const BE = false;

  return {
    width: Number(dataView.getUint32(HEADER_OFFSET, BE).toString(10)),
    height: Number(dataView.getUint32(4 + HEADER_OFFSET, BE).toString(10)),
  };
}
