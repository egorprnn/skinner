import { SkinViewer } from 'skinview3d';

import { SkinRendererObserver } from './observer';

export interface SkinRendererOptions {
  skin: string;
  width: number;
  height: number;
  container: HTMLElement;
  position: 'top' | 'middle' | 'bottom';
}

export class SkinRenderer {
  static #renderer = new SkinViewer({
    renderPaused: true,
  });
  static #renderers: Set<SkinRenderer>;
  static #observer = SkinRendererObserver;

  readonly #options: SkinRendererOptions;

  #rendered = false;
  #rendering = false;
  #destroyed = false;

  #url = '';
  #renderingPromise = Promise.resolve(this.#url);

  constructor(options: SkinRendererOptions) {
    this.#options = options;

    SkinRenderer.#renderers.add(this);
    SkinRenderer.#observer.addRenderer(this);
  }

  get container() {
    return this.#options.container;
  }

  get rendered() {
    return this.#rendered;
  }

  get rendering() {
    return this.#rendering;
  }

  get destroyed() {
    return this.#destroyed;
  }

  render() {
    if (this.#rendering || this.#rendered) {
      return this.#renderingPromise;
    }

    this.#renderingPromise = new Promise<string>(async (resolve, reject) => {
      const { width, height, skin, position } = this.#options;

      this.#rendering = true;

      SkinRenderer.#renderer.setSize(width, height);

      await SkinRenderer.#renderer.loadSkin(skin).catch(reject);

      switch (position) {
        case 'top':
          this.#setCameraToTop();
          break;
        case 'middle':
          this.#setCameraToMiddle();
          break;
        case 'bottom':
          this.#setCameraToBottom();
          break;
      }

      SkinRenderer.#renderer.render();

      SkinRenderer.#renderer.canvas.toBlob((blob) => {
        if (!blob) {
          return reject();
        }

        this.#url = URL.createObjectURL(blob);
        this.#rendered = true;

        resolve(this.#url);
      });
    });

    return this.#renderingPromise;
  }

  destroy() {
    URL.revokeObjectURL(this.#url);

    SkinRenderer.#renderers.delete(this);
    SkinRenderer.#observer.removeRenderer(this);
  }

  #setCameraToTop() {}

  #setCameraToMiddle() {}

  #setCameraToBottom() {}
}
