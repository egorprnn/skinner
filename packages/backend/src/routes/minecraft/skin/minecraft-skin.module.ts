import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MinecraftSkin } from './minecraft-skin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MinecraftSkin])],
  /*providers: [UserService],
  exports: [UserService],*/
})
export class MinecraftSkinModule {}
