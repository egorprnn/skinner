import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MinecraftCape } from './minecraft-cape.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MinecraftCape])],
  /*providers: [UserService],
  exports: [UserService],*/
})
export class MinecraftCapeModule {}
