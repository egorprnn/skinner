import { SkinRenderer } from './';
import { SkinRendererObserverLazyLoad } from './lazyLoading';

export class SkinRendererObserver {
  static #observer: IntersectionObserver;
  static #renderers = new Set<SkinRenderer>();

  static {
    this.#observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        const renderer = [...this.#renderers]?.find((renderer) => renderer.container === target);

        if (!renderer) {
          continue;
        }

        const { rendered, rendering } = renderer;

        if (isIntersecting) {
          if (!rendered && !rendering) {
            SkinRendererObserverLazyLoad.addToQueue(renderer);
          }
        } else {
          SkinRendererObserverLazyLoad.removeFromQueue(renderer);

          if (!renderer.container.isConnected) {
            renderer.destroy();
          }
        }
      }
    });
  }

  /**
   * Добавляет проигрыватель для отслеживания
   */
  public static addRenderer(renderer: SkinRenderer) {
    const { container } = renderer;

    this.#renderers.add(renderer);
    this.#observer.observe(container);
  }

  /**
   * Удаляет проигрыватель из отслеживания
   */
  public static removeRenderer(renderer: SkinRenderer) {
    const { container } = renderer;

    this.#renderers.delete(renderer);
    this.#observer?.unobserve(container);
  }
}
