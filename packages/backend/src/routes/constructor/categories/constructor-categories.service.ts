import { IsNull } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { ConstructorCategoryService } from '../category/constructor-category.service';

@Injectable()
export class ConstructorCategoriesService {
  constructor(private readonly constructorCategoryService: ConstructorCategoryService) {}

  findAll() {
    return this.constructorCategoryService.constructorCategoryRepository.find({
      where: { parent: IsNull() },
      relations: ['children'],
    });
  }
}
