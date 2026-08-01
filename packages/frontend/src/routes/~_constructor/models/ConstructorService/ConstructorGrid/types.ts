import type { APISchemas } from '@skinner/api-schema';

export type ConstructorGridItems = ConstructorGridItemsRow[];

export const enum ConstructorGridRowType {
  ITEMS = 'ITEMS',
}

export interface ConstructorGridItemsRow {
  type: ConstructorGridRowType.ITEMS;
  items: APISchemas['ConstructorItemDto'][];
}
