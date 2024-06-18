import { SyncStore } from './';
import { Atom, type AtomOptions, type AtomSetOptions } from '../atom';

export interface SyncAtomOptions extends AtomOptions {
  base: SyncStore;
  type: SyncAtomType;
}

export enum SyncAtomType {
  OBJECT = 'object',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  STRING_NUMBER = 'string_number',
}

export class SyncAtom<T> extends Atom<T> {
  protected readonly base: SyncAtomOptions['base'];
  protected readonly type: SyncAtomOptions['type'];

  public constructor(options: SyncAtomOptions) {
    super(options);

    const { base, type } = options;

    this.base = base;
    this.type = type;
  }

  /**
   * Получает значение ключа
   */
  public get(): T | null {
    const key = this.getKey();

    try {
      let item: any = localStorage.getItem(key);

      if (!item) {
        return null;
      }

      switch (this.type) {
        case SyncAtomType.OBJECT:
          try {
            item = JSON.parse(item);
          } catch {
            return null;
          }
          break;
        case SyncAtomType.NUMBER:
          item = Number(item) || 0;
          break;
        case SyncAtomType.STRING_NUMBER:
          item = Number(item) || item;
          break;
        case SyncAtomType.BOOLEAN:
          item = Boolean(Number(item));
          break;
      }

      return item as T;
    } catch (error) {
      console.log(`${key}: Ошибка чтения данных из хранилища`);
      console.log(error);

      return this.cache || null;
    }
  }

  /**
   * Устанавливает значение ключа
   */
  public set(value: T, options?: AtomSetOptions) {
    const key = this.getKey();

    let serializedValue: string;

    switch (this.type) {
      case SyncAtomType.OBJECT:
        serializedValue = JSON.stringify(value);
        break;
      case SyncAtomType.BOOLEAN:
        serializedValue = String(Number(value));
        break;
      default:
        serializedValue = String(value);
        break;
    }

    try {
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.log(`${key}: Не удалось записать данные в хранилище`);
      console.log(error);

      this.cache = value;
    }

    super.set(value, options);
  }

  /**
   * Удаляет ключ
   */
  public delete() {
    const key = this.getKey();

    try {
      delete this.cache;

      localStorage.removeItem(key);
    } catch (error) {
      console.log(`${key}: Ошибка удаления ключа из хранилища`);
      console.log(error);
    }
  }

  protected getKey() {
    return `${this.base.key}-${this.key}`;
  }
}
