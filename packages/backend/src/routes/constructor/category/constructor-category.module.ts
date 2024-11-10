import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConstructorCategory } from './constructor-category.entity';
import { ConstructorCategoryService } from './constructor-category.service';
import { ConstructorCategoryController } from './constructor-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConstructorCategory])],
  controllers: [ConstructorCategoryController],
  providers: [ConstructorCategoryService],
  exports: [ConstructorCategoryService],
})
export class ConstructorCategoryModule {}
