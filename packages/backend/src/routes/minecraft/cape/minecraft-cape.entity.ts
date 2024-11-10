import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

import { User } from '../../user/user.entity';

@Entity()
export class MinecraftCape {
  @PrimaryColumn()
  declare id: string;

  @Column({ nullable: false })
  declare alias: string;

  @Column({ nullable: false })
  declare texture_key: string;

  @ManyToMany(() => User, (user) => user.minecraft_capes)
  declare users: User[];
}
