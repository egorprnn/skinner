import { Controller, Get } from '@nestjs/common';
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, type PaginateQuery } from 'nestjs-paginate';

import { ConstructorItemDto } from '../item/dto/constructor-item.dto';
import { ConstructorItemsService } from './constructor-items.service';

import { ApiGlobalExceptions } from '../../../decorators/api-global-exceptions.decorator';

@Controller('constructor-items')
@ApiGlobalExceptions()
export class ConstructorItemsController {
  constructor(private readonly constructorItemsService: ConstructorItemsService) {}

  @Get()
  @ApiPaginationQuery(ConstructorItemsService.PAGINATION_CONFIG)
  @ApiOkPaginatedResponse(ConstructorItemDto, ConstructorItemsService.PAGINATION_CONFIG)
  get(@Paginate() query: PaginateQuery) {
    return this.constructorItemsService.getPaginated(query);
  }
}
