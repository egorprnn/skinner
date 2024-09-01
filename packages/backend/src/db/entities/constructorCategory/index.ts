import { z } from 'zod';
import { instanceToPlain } from 'class-transformer';
import { Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { ConstructorItem } from '../constructorItem';

import { constructorCategorySchema } from './schema';

@Entity()
export class ConstructorCategory {
  @PrimaryColumn()
  declare id: string;

  @ManyToOne(() => ConstructorCategory, (constructorCategory) => constructorCategory.children)
  declare parent: ConstructorCategory | null;

  @OneToMany(() => ConstructorCategory, (constructorCategory) => constructorCategory.parent)
  declare children: ConstructorCategory[];

  @OneToMany(() => ConstructorItem, (constructorItem) => constructorItem.category)
  declare items: ConstructorItem[];

  toJSON() {
    return instanceToPlain(this) as z.infer<typeof constructorCategorySchema>;
  }
}
