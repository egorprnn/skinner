import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ApiGlobalExceptions } from '../../../decorators/api-global-exceptions.decorator';

import { AuthGuard } from '../../auth/auth.guard';
import { ConstructorCategoriesDto } from './dto/constructor-categories.dto';
import { ConstructorCategoriesService } from './constructor-categories.service';

@Controller('constructor-categories')
@ApiGlobalExceptions()
export class ConstructorCategoriesController {
  constructor(private readonly constructorCategoriesService: ConstructorCategoriesService) {}

  @Get()
  @AuthGuard.Skip()
  @ApiOperation({ summary: 'Returns all existing constructor categories' })
  @ApiResponse({ status: 200, type: ConstructorCategoriesDto })
  async all() {
    return ConstructorCategoriesDto.create(await this.constructorCategoriesService.findAll());
  }
}
