import { EsThread } from 'threads-es';

import type { AvatarRendererWorkerAPI } from './index.worker';

import { BrowserSprite, BrowserSymbol } from '../browserSprite';

export class AvatarRenderer {
  static #sprite = new BrowserSprite('__SPRITE_AVATAR_RENDERER__');
  static #worker = EsThread.Spawn<AvatarRendererWorkerAPI>(
    new Worker(new URL('./index.worker.ts', import.meta.url), { type: 'module' }),
  );

  static async render(url: string) {
    if (this.#sprite.has(url)) {
      return;
    }

    const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');

    symbol.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    symbol.setAttribute('viewBox', '0 0 8 8');
    symbol.setAttribute('shape-rendering', 'crispEdges');
    symbol.setAttribute('id', url);

    this.#sprite.add(new BrowserSymbol(symbol));

    const worker = await this.#worker;

    const rects = await worker.methods.getRects(url).catch(() => null);

    if (!rects) {
      this.#sprite.delete(url);

      return;
    }

    rects.forEach(([x, y, ...fill]) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(y));
      rect.setAttribute('width', String(1));
      rect.setAttribute('height', String(1));
      rect.setAttribute('fill', `rgba(${fill.join(',')})`);

      symbol.appendChild(rect);
    });
  }
}
