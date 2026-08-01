export interface StoreOptions {
  /**
   * Имя базы данных
   */
  dbName: string;
  /**
   * Версия хранилища
   */
  version: number;
  /**
   * Имя таблицы в базе данных
   */
  storeName: string;
}

export type StoreListener = (key?: string) => unknown;

export class Store {
  public static readonly instances = new Map<string, Store>();

  static {
    window.addEventListener('storage', ({ key, newValue }: StorageEvent) => {
      if (!key || newValue === null) {
        return;
      }

      const store = this.instances.get(key);

      store?.notify();
    });
  }

  public readonly options: StoreOptions;

  /**
   * Обработчики изменения хранилища
   */
  private readonly listeners = new Set<StoreListener>();
  /**
   * Обработчики синхронизации между вкладками
   */
  private readonly syncListeners = new Set<StoreListener>();

  constructor(options: StoreOptions) {
    this.options = options;

    Store.instances.set(this.key, this);
  }

  /**
   * Подписывает на обновления хранилища
   */
  public subscribe(listener: StoreListener, sync?: boolean) {
    const listeners = this.getListeners(sync);

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  /**
   * Оповещает слушателей об обновлении ключа
   *
   * @hidden
   */
  public notify(key?: string, sync?: boolean) {
    const listeners = this.getListeners(sync);

    listeners.forEach((listener) => {
      listener(key);
    });
  }

  /**
   * Вызывает событие обновления для всех вкладок браузера
   */
  public refresh() {
    try {
      localStorage.setItem(this.key, '');
      localStorage.removeItem(this.key);
    } catch {}
  }

  /**
   * Функция отчистки
   */
  public destroy() {
    this.listeners.clear();
    this.syncListeners.clear();

    Store.instances.delete(this.key);
  }

  /**
   * Ключ хранилища
   */
  public get key() {
    const { dbName, storeName, version } = this.options;

    return `${dbName}-v${version}-${storeName}`;
  }

  private getListeners(sync?: boolean) {
    return sync ? this.syncListeners : this.listeners;
  }
}
