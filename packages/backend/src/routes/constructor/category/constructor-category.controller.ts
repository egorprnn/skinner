import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

import { ApiGlobalExceptions } from '../../../decorators/api-global-exceptions.decorator';

import { ConstructorCategoryDto } from './dto/constructor-category.dto';
import { ConstructorCategoryService } from './constructor-category.service';
import { ConstructorCategoryCreateDto } from './dto/constructor-category-create.dto';

@Controller('constructor-category')
@ApiGlobalExceptions()
export class ConstructorCategoryController {
  constructor(private readonly constructorCategoryService: ConstructorCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Creates new constructor category' })
  @ApiResponse({ status: 200, type: ConstructorCategoryDto })
  async create(@Body() constructorCategoryCreateDto: ConstructorCategoryCreateDto) {
    return ConstructorCategoryDto.create(await this.constructorCategoryService.create(constructorCategoryCreateDto));
  }
}
