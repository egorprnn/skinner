import { z } from 'zod';
import { instanceToPlain } from 'class-transformer';
import { Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { constructorCategorySchema } from './schema';

@Entity()
export class ConstructorCategory {
  @PrimaryColumn()
  declare id: string;

  @ManyToOne(() => ConstructorCategory, (constructorCategory) => constructorCategory.children)
  declare parent: ConstructorCategory | null;

  @OneToMany(() => ConstructorCategory, (constructorCategory) => constructorCategory.parent)
  declare children: ConstructorCategory[];

  toJSON() {
    return instanceToPlain(this) as z.infer<typeof constructorCategorySchema>;
  }
}
