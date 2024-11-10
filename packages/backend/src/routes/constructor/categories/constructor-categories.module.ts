import { Module } from '@nestjs/common';

import { ConstructorCategoriesService } from './constructor-categories.service';
import { ConstructorCategoryModule } from '../category/constructor-category.module';
import { ConstructorCategoriesController } from './constructor-categories.controller';

@Module({
  imports: [ConstructorCategoryModule],
  controllers: [ConstructorCategoriesController],
  providers: [ConstructorCategoriesService],
  exports: [ConstructorCategoriesService],
})
export class ConstructorCategoriesModule {}
