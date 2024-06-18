import { throttle } from '@vkontakte/vkjs';

import type { SkinRenderer } from './';

export class SkinRendererObserverLazyLoad {
  /**
   * Лимит одновременной обработки проигрывателей при ленивой загрузке
   */
  static readonly #PROCESSING_LIMIT = 8;

  /**
   * Очередь ленивой загрузки
   */
  static #queue = new Set<SkinRenderer>();
  /**
   * Проигрыватели обрабатываемые ленивой загрузкой
   */
  static #processing = new Set<SkinRenderer>();

  /**
   * Добавляет проигрыватель в очередь для обработки ленивой загрузки
   */
  public static addToQueue(renderer: SkinRenderer) {
    this.#queue.add(renderer);
    this.#processQueue();
  }

  public static removeFromQueue(renderer: SkinRenderer) {
    this.#queue.delete(renderer);
  }

  /**
   * Запускает обработку очереди ленивой загрузки
   */
  static #processQueue = throttle(this.#processQueueHandler.bind(this), 20);
  static async #processQueueHandler() {
    if (!this.#queue.size || this.#processing.size) {
      return;
    }

    while (this.#processing.size < this.#PROCESSING_LIMIT && this.#queue.size) {
      const player = [...this.#queue].shift();

      if (!player) {
        continue;
      }

      this.#queue.delete(player);

      await this.#processRenderer(player);
    }
  }

  /**
   * Загружает проигрыватель при обработке через ленивую загрузку
   */
  static async #processRenderer(renderer: SkinRenderer) {
    this.#processing.add(renderer);

    await renderer.render();

    this.#processing.delete(renderer);

    this.#processQueue();
  }
}
