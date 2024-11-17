import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ConstructorItemDto } from './dto/constructor-item.dto';
import { ConstructorItemService } from './constructor-item.service';
import { ConstructorItemCreateDto } from './dto/constructor-item-create.dto';
import { ConstructorCategoryDto } from '../category/dto/constructor-category.dto';

@Controller('constructor-item')
export class ConstructorItemController {
  constructor(private readonly constructorItemService: ConstructorItemService) {}

  @Post()
  @ApiOperation({ summary: 'Creates new constructor item' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, type: ConstructorCategoryDto })
  async create(@Body() constructorItemCreateDto: ConstructorItemCreateDto) {
    return ConstructorItemDto.create(await this.constructorItemService.create(constructorItemCreateDto));
  }
}
