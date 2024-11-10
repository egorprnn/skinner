import { Body, Controller, Post } from '@nestjs/common';

import { ConstructorItemService } from './constructor-item.service';
import { ConstructorItemCreateDto } from './dto/constructor-item-create.dto';

@Controller('constructor-item')
export class ConstructorItemController {
  constructor(private readonly constructorItemService: ConstructorItemService) {}

  @Post()
  create(@Body() constructorItemCreateDto: ConstructorItemCreateDto) {
    return this.constructorItemService.create(constructorItemCreateDto);
  }
}
