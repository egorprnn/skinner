import * as Sentry from '@sentry/bun';
import { instanceToPlain } from 'class-transformer';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';
import { AfterLoad, AfterUpdate, BeforeInsert, Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

import { User } from './user';
import { S3 } from '../../modules';

@Entity()
export class MinecraftSkin {
  @PrimaryColumn()
  declare id: string;

  @Column({
    type: 'enum',
    enum: MinecraftTextureVariant,
  })
  declare variant: MinecraftTextureVariant;

  @Column()
  declare texture_key?: string;
  get texture_key_url() {
    if (!this.texture_key) {
      return;
    }

    return `https://textures.minecraft.net/texture/${this.texture_key}`;
  }

  @ManyToMany(() => User, (user) => user.minecraft_skins)
  declare users: User[];

  private get s3_key() {
    return `minecraft-skin-${this.id}`;
  }

  declare url?: string;
  @AfterLoad()
  @AfterUpdate()
  async loadUrl() {
    this.url = await S3.createPresignedUrl({
      key: this.s3_key,
    }).catch((error) => {
      Sentry.captureException(error);

      return this.texture_key_url;
    });
  }

  @BeforeInsert()
  protected async uploadTextureToS3() {
    if (!this.texture_key_url) {
      return;
    }

    const blob = await fetch(this.texture_key_url)
      .then((response) => response.blob())
      .catch((error) => {
        Sentry.captureException(error);

        return null;
      });

    if (!blob) {
      return;
    }

    return S3.client
      .putObject({
        Bucket: S3.BUCKET_NAME,
        Key: this.s3_key,
        Body: Buffer.from(await blob.arrayBuffer()),
        ContentType: blob.type,
      })
      .catch(Sentry.captureException);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
