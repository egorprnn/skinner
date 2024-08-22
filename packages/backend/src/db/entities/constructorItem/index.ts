import * as Sentry from '@sentry/bun';
import { instanceToPlain } from 'class-transformer';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';
import { AfterLoad, AfterUpdate, BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from '../';
import { S3 } from '../../../modules';

import { constructorItemSchema } from './schema';

@Entity()
export class ConstructorItem {
  @PrimaryColumn({
    type: 'char',
    length: constructorItemSchema.shape.id.maxLength!,
  })
  declare id: string;

  /**
   * Title
   */
  @Column({ length: constructorItemSchema.shape.title.maxLength!, nullable: false })
  declare title: string;

  /**
   * Description
   */
  @Column({ length: constructorItemSchema.shape.description.maxLength! })
  declare description?: string;

  @Column({
    type: 'enum',
    enum: MinecraftTextureVariant,
    nullable: false,
  })
  declare variant: MinecraftTextureVariant;

  declare url?: string;
  @AfterLoad()
  @AfterUpdate()
  async loadUrl() {
    const url = await S3.createPresignedUrl({
      key: this.s3_key,
    }).catch((error) => {
      Sentry.captureException(error);
    });

    if (!url) {
      return;
    }

    this.url = url;
  }

  private declare file?: Blob;
  @BeforeInsert()
  protected async uploadFileToS3() {
    if (!this.file) {
      throw new Error('Set file field before insert new entity');
    }

    return S3.client
      .putObject({
        Bucket: S3.BUCKET_NAME,
        Key: this.s3_key,
        Body: Buffer.from(await this.file.arrayBuffer()),
        ContentType: this.file.type,
      })
      .catch(Sentry.captureException);
  }

  private get s3_key() {
    return `constructor-item-${this.id}`;
  }

  /**
   * Owner
   */
  @ManyToOne(() => User, (user) => user.constructor_items, {
    eager: true,
  })
  declare owner: User;

  toJSON() {
    return instanceToPlain(this);
  }
}
