import { makeAutoObservable } from 'mobx';
import { chunkArray } from '@vkontakte/vkjs';
import { createProvider, scope } from '@skinner/di';

import { ConstructorService } from '../ConstructorService';
import { type ConstructorGridItems, ConstructorGridRowType } from './types';

@scope.container()
export class ConstructorGrid {
  readonly ITEMS_ROW_COLUMNS = 4;

  constructor(private readonly constructorService: ConstructorService) {
    makeAutoObservable(this);
  }

  get items(): ConstructorGridItems {
    const rows: ConstructorGridItems = [];

    for (const items of chunkArray(this.constructorService.activeCategoryItems, this.ITEMS_ROW_COLUMNS)) {
      rows.push({
        type: ConstructorGridRowType.ITEMS,
        items,
      });
    }

    return rows;
  }
}

export const { Provider: ConstructorGridProvider, useModel: useConstructorGridProvider } =
  createProvider(ConstructorGrid);
