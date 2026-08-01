import { Store, type StoreOptions } from '../store';
import { SyncAtom, SyncAtomType } from './atom';

export class SyncStore extends Store {
  public createAtom<T>(key: string, type: SyncAtomType) {
    return new SyncAtom<T>({
      key,
      type,
      base: this,
    });
  }
}

export function createSyncStore(options: StoreOptions) {
  return new SyncStore(options);
}
