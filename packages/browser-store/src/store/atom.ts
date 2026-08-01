import { Store } from './store';

export interface AtomOptions {
  key: string;
  base: Store;
}

export interface AtomSetOptions {
  /**
   * Оповестить слушателей об изменении
   */
  notify?: boolean;
}

export class Atom<T> {
  protected readonly key: AtomOptions['key'];
  protected readonly base: AtomOptions['base'];

  protected cache: T | undefined;

  public constructor({ key, base }: AtomOptions) {
    this.key = key;
    this.base = base;
  }

  public set(_: T, { notify = true }: AtomSetOptions = {}) {
    if (notify) {
      this.base.notify(this.key);
    }
  }

  protected getKey() {
    return `${this.base.options.storeName}-${this.key}`;
  }
}
