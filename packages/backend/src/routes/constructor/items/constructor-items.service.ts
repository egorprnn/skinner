import { Injectable } from '@nestjs/common';
import { FilterOperator, paginate, type PaginateQuery, type PaginateConfig } from 'nestjs-paginate';

import type { ConstructorItem } from '../item/constructor-item.entity';
import { ConstructorItemService } from '../item/constructor-item.service';

@Injectable()
export class ConstructorItemsService {
  static readonly PAGINATION_CONFIG: PaginateConfig<ConstructorItem> = {
    loadEagerRelations: true,
    relations: {
      owner: true,
      category: true,
    },
    sortableColumns: ['id', 'title', 'description', 'variant'],
    // nullSort: 'last',
    defaultSortBy: [['id', 'DESC']],
    searchableColumns: ['title', 'description'],
    select: [
      'id',
      'title',
      'description',
      'variant',
      'category.id',
      'owner.uuid',
      'owner.name',
      'owner.minecraft_active_skin',
    ],
    maxLimit: 20,
    defaultLimit: 20,
    filterableColumns: {
      'category.id': [FilterOperator.EQ],
    },
  };

  constructor(private readonly constructorItemService: ConstructorItemService) {}

  getPaginated(query: PaginateQuery) {
    return paginate(
      query,
      this.constructorItemService.constructorItemRepository,
      ConstructorItemsService.PAGINATION_CONFIG,
    );
  }
}
