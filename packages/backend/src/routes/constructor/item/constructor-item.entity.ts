import * as Sentry from '@sentry/nestjs';
import { instanceToPlain } from 'class-transformer';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';
import { AfterLoad, AfterUpdate, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { S3 } from '../../../modules';

import { User } from '../../user/user.entity';
import { ConstructorItemSchema } from './dto/constructor-item.dto';
import { ConstructorCategory } from '../category/constructor-category.entity';

@Entity()
export class ConstructorItem {
  @PrimaryColumn({
    type: 'char',
    length: ConstructorItemSchema.shape.id.maxLength!,
  })
  declare id: string;

  /**
   * Title
   */
  @Column({ length: ConstructorItemSchema.shape.title.maxLength!, nullable: false })
  declare title: string;

  /**
   * Description
   */
  @Column({ length: ConstructorItemSchema.shape.description.maxLength! })
  declare description?: string;

  @Column({
    type: 'enum',
    enum: MinecraftTextureVariant,
    nullable: false,
  })
  declare variant: MinecraftTextureVariant;

  /**
   * Owner
   */
  @ManyToOne(() => User, (user) => user.constructor_items, {
    eager: true,
  })
  declare owner: User;

  /**
   * Category
   */
  @ManyToOne(() => ConstructorCategory, (constructorCategory) => constructorCategory.items, {
    eager: true,
  })
  declare category: ConstructorCategory;

  declare url?: string;
  @AfterLoad()
  @AfterUpdate()
  async loadUrl() {
    try {
      this.url = await S3.createPresignedUrl({
        key: this.s3_key,
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  get s3_key() {
    return `constructor-item-${this.id}`;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
