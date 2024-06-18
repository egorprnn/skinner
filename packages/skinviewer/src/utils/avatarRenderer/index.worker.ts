import { exposeApi } from 'threads-es';

const regions = [
  { x: 8, y: 8, width: 8, height: 8 },
  { x: 40, y: 8, width: 8, height: 8 },
] as const;

class AvatarRendererWorker {
  static async getRects(url: string) {
    const image = await fetch(url)
      .then((response) => response.blob())
      .then(createImageBitmap);
    const { width, height } = image;

    const canvas = new OffscreenCanvas(width, height);

    const context = canvas.getContext('2d')!;

    context.drawImage(image, 0, 0, width, height);

    image.close();

    const { data } = context.getImageData(0, 0, width, height);

    const rects: [number, number, number, number, number, number][] = [];

    for (const region of regions) {
      for (let x = region.x; x < region.x + region.width; x++) {
        for (let y = region.y; y < region.y + region.height; y++) {
          const rectX = x - region.x;
          const rectY = y - region.y;

          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          if (!r && !g && !b && !a) {
            continue;
          }

          rects.push([rectX, rectY, r, g, b, Number((a / 255).toFixed(2))]);
        }
      }
    }

    return rects;
  }
}

export type AvatarRendererWorkerAPI = typeof avatarRendererWorker;
const avatarRendererWorker = {
  getRects: AvatarRendererWorker.getRects.bind(AvatarRendererWorker),
};

exposeApi(avatarRendererWorker);
