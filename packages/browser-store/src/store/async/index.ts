import { createStore, clear, type UseStore } from 'idb-keyval';

import { Store, type StoreOptions } from '../store';
import { AsyncAtom, type AsyncAtomOptions } from './atom';

export class AsyncStore extends Store {
  public readonly store?: UseStore;

  public constructor(options: StoreOptions) {
    super(options);

    const { dbName, version } = options;

    try {
      this.store = createStore(`${dbName}-v${version}`, dbName);
    } catch {}
  }

  public createAtom<T>(key: AsyncAtomOptions['key']) {
    return new AsyncAtom<T>({
      key,
      base: this,
    });
  }

  /**
   * Отчищает хранилище
   */
  public async clear() {
    await clear(this.store);
    this.notify();
  }
}

export function createAsyncStore(options: StoreOptions) {
  return new AsyncStore(options);
}
