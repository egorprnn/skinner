import { z } from 'zod';
import { instanceToPlain } from 'class-transformer';
import { Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { ConstructorItem } from '../item/constructor-item.entity';
import type { ConstructorCategorySchema } from './schema/constructor-category.schema';

@Entity()
export class ConstructorCategory {
  @PrimaryColumn()
  declare id: string;

  @ManyToOne(() => ConstructorCategory, (constructorCategory) => constructorCategory.children, {
    cascade: true,
  })
  declare parent: ConstructorCategory | null;

  @OneToMany(() => ConstructorCategory, (constructorCategory) => constructorCategory.parent)
  declare children: ConstructorCategory[];

  @OneToMany(() => ConstructorItem, (constructorItem) => constructorItem.category)
  declare items: ConstructorItem[];

  toJSON() {
    return instanceToPlain(this) as z.infer<typeof ConstructorCategorySchema>;
  }
}
