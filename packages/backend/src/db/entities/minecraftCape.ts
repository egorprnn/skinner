import { z } from 'zod';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

import { User } from './user';

@Entity()
export class MinecraftCape {
  static readonly schema = z.object({
    id: z
      .string({
        description: 'ID',
      })
      .min(1),
    alias: z.string({
      description: 'Minecraft cape alias',
    }),
    texture_key: z.string({
      description: 'Minecraft cape texture key',
    }),
  });

  @PrimaryColumn()
  declare id: string;

  @Column({ nullable: false })
  declare alias: string;

  @Column({ nullable: false })
  declare texture_key: string;

  @ManyToMany(() => User, (user) => user.minecraft_capes)
  declare users: User[];
}
