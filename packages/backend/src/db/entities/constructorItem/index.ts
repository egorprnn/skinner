import * as Sentry from '@sentry/bun';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { S3 } from '../../../modules';

@Entity()
export class ConstructorItem {
  @PrimaryGeneratedColumn('increment')
  declare id: string;

  /**
   * Title
   */
  @Column({ length: 64, nullable: false })
  declare title: string;

  /**
   * Description
   */
  @Column({ length: 256 })
  declare description?: string;

  @Column({
    type: 'enum',
    enum: MinecraftTextureVariant,
    nullable: false,
  })
  declare variant: MinecraftTextureVariant;

  private get s3_key() {
    return `constructor-item-${this.id}`;
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
}
