import { SkinViewer, type SkinViewerOptions } from 'skinview3d';

import { SkinRendererObserver } from './observer';

export const enum SkinRendererPosition {
  HEAD = 'head',
  BODY = 'body',
  LEGS = 'legs',
  BOOTS = 'boots',
}

export interface SkinRendererOptions {
  /**
   * Источник скина
   */
  skin: Required<SkinViewerOptions>['skin'] | File | Blob;
  /**
   * Высота рендера
   */
  height: Required<SkinViewerOptions>['height'];
  /**
   * Ширина рендера
   */
  width: Required<SkinViewerOptions>['height'];
  /**
   * Элемент, к которому принадлежит рендрер
   */
  container: HTMLElement;
  /**
   * Положение камеры
   */
  position: SkinRendererPosition;
}

export class SkinRenderer {
  static #renderer = new SkinViewer({
    renderPaused: true,
  });
  static #renderers = new Set<SkinRenderer>();
  static #observer = SkinRendererObserver;

  readonly #options: SkinRendererOptions;

  #url = '';

  #rendered = false;
  #rendering = false;
  #destroyed = false;

  #resolve!: Parameters<ConstructorParameters<typeof Promise<string>>[0]>[0];
  #reject!: Parameters<ConstructorParameters<typeof Promise<string>>[0]>[1];
  #promise = new Promise<string>((resolve, reject) => {
    this.#resolve = resolve;
    this.#reject = reject;
  });

  constructor(options: SkinRendererOptions) {
    this.#options = options;
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
    SkinRenderer.#renderers.add(this);
    SkinRenderer.#observer.addRenderer(this);

    return this.#promise;
  }

  destroy() {
    URL.revokeObjectURL(this.#url);

    SkinRenderer.#renderers.delete(this);
    SkinRenderer.#observer.removeRenderer(this);
  }

  private async _render() {
    if (this.#rendering || this.#rendered) {
      return this.#promise;
    }

    let { width, height, skin, position } = this.#options;

    this.#rendering = true;

    SkinRenderer.#renderer.setSize(width, height);

    try {
      if (skin instanceof File || skin instanceof Blob) {
        skin = await createImageBitmap(skin);
      }

      await SkinRenderer.#renderer.loadSkin(skin);
    } catch {
      this.#resolve('');

      return;
    }

    switch (position) {
      case SkinRendererPosition.HEAD:
        this.#setCameraToHead();
        break;
      case SkinRendererPosition.BODY:
        this.#setCameraToHead();
        break;
      /*case SkinRendererPosition.MIDDLE:
        this.#setCameraToMiddle();
        break;
      case SkinRendererPosition.BOTTOM:
        this.#setCameraToBottom();
        break;*/
    }

    SkinRenderer.#renderer.adjustCameraDistance();

    SkinRenderer.#renderer.render();
    SkinRenderer.#renderer.canvas.toBlob((blob) => {
      if (!blob) {
        return this.#reject();
      }

      this.#url = URL.createObjectURL(blob);
      this.#rendered = true;

      this.#resolve(this.#url);
    });

    return this.#promise;
  }

  #setCameraToHead() {
    SkinRenderer.#renderer.camera.zoom = 2;
    SkinRenderer.#renderer.camera.position.set(-20, -0.25, 30);
    SkinRenderer.#renderer.camera.rotation.set(0, -0.5, 0);
  }

  #setCameraToBody() {
    SkinRenderer.#renderer.camera.zoom = 2;
    SkinRenderer.#renderer.camera.position.set(-11.25, 1, 20);
    SkinRenderer.#renderer.camera.rotation.set(0, -0.5, 0);
  }

  #setCameraToMiddle() {}

  #setCameraToBottom() {}
}
