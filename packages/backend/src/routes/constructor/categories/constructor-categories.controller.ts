import { Controller, Get } from '@nestjs/common';
import type { ConstructorCategoriesService } from './constructor-categories.service';

@Controller('constructor-categories')
export class ConstructorCategoriesController {
  constructor(private readonly constructorCategoriesService: ConstructorCategoriesService) {}

  @Get()
  all() {
    return this.constructorCategoriesService.findAll();
  }
}
