import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ConstructorCategory } from './constructor-category.entity';
import type { ConstructorCategoryCreateDto } from './dto/constructor-category-create.dto';

@Injectable()
export class ConstructorCategoryService {
  constructor(
    @InjectRepository(ConstructorCategory)
    public constructorCategoryRepository: Repository<ConstructorCategory>,
  ) {}

  async create({ id, parent }: ConstructorCategoryCreateDto) {
    let constructorCategory = await this.constructorCategoryRepository.findOne({
      where: {
        id,
      },
      relations: ['parent', 'children'],
    });

    if (constructorCategory) {
      return constructorCategory;
    }

    constructorCategory = new ConstructorCategory();

    constructorCategory.id = id;

    if (parent) {
      constructorCategory.parent = new ConstructorCategory();
      constructorCategory.parent.id = parent;
    }

    await this.constructorCategoryRepository.save(constructorCategory);

    return await this.constructorCategoryRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['parent', 'children'],
    });
  }
}
