import { Module } from '@nestjs/common';

import { ConstructorItemsService } from './constructor-items.service';
import { ConstructorItemModule } from '../item/constructor-item.module';
import { ConstructorItemsController } from './constructor-items.controller';

@Module({
  imports: [ConstructorItemModule],
  controllers: [ConstructorItemsController],
  providers: [ConstructorItemsService],
  exports: [ConstructorItemsService],
})
export class ConstructorItemsModule {}
