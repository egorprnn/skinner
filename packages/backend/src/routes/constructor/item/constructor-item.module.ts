import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConstructorItem } from './constructor-item.entity';
import { ConstructorItemService } from './constructor-item.service';
import { ConstructorItemController } from './constructor-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConstructorItem])],
  controllers: [ConstructorItemController],
  providers: [ConstructorItemService],
  exports: [ConstructorItemService],
})
export class ConstructorItemModule {}
