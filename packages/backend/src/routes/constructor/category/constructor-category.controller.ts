import { Body, Controller, Post } from '@nestjs/common';
import { ConstructorCategoryService } from './constructor-category.service';
import { ConstructorCategoryCreateDto } from './dto/constructor-category-create.dto';

@Controller('constructor-category')
export class ConstructorCategoryController {
  constructor(private readonly constructorCategoryService: ConstructorCategoryService) {}

  @Post()
  create(@Body() constructorCategoryCreateDto: ConstructorCategoryCreateDto) {
    return this.constructorCategoryService.create(constructorCategoryCreateDto);
  }
}
