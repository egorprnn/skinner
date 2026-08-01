import { get, set, del } from 'idb-keyval';

import type { AsyncStore } from './';
import { Atom, type AtomOptions, type AtomSetOptions } from '../atom';

export interface AsyncAtomOptions extends AtomOptions {
  base: AsyncStore;
}

export class AsyncAtom<T> extends Atom<T> {
  protected readonly base: AsyncStore;

  public constructor(options: AsyncAtomOptions) {
    super(options);

    const { base } = options;

    this.base = base;
  }

  public async get(): Promise<T | null> {
    const key = this.getKey();

    try {
      const value = await get<T>(key, this.base.store);
      return value || this.cache || null;
    } catch (error) {
      console.log(`${key}: Ошибка чтения данных из хранилища`);
      console.log(error);
      return this.cache || null;
    }
  }

  public async set(value: T, options?: AtomSetOptions) {
    const key = this.getKey();

    try {
      await set(key, value, this.base.store);
    } catch (error) {
      console.log(`${key}: Не удалось записать данные в хранилище`);
      console.log(error);

      this.cache = value;
    }

    super.set(value, options);
  }

  public async delete() {
    const key = this.getKey();

    delete this.cache;

    try {
      await del(key, this.base.store);
      this.base.notify(this.key);
    } catch (error) {
      console.log(`${key}: Ошибка удаления ключа из хранилища`);
      console.log(error);
    }
  }
}
