import crypto from 'crypto';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { S3 } from '../../../modules';
import { ConstructorItem } from './constructor-item.entity';
import { ConstructorItemCreateDto } from './dto/constructor-item-create.dto';
import { ConstructorCategory } from '../category/constructor-category.entity';

@Injectable()
export class ConstructorItemService {
  constructor(
    @InjectRepository(ConstructorItem)
    public constructorItemRepository: Repository<ConstructorItem>,
  ) {}

  async create({ file, title, description, variant, category }: ConstructorItemCreateDto) {
    const fileBinary = new Uint8Array(await file.arrayBuffer());
    const hash = crypto.createHash('sha256').update(fileBinary).digest('hex');

    let constructorItem = await this.constructorItemRepository.findOne({
      where: {
        id: hash,
      },
    });

    if (constructorItem) {
      return constructorItem;
    }

    constructorItem = new ConstructorItem();

    constructorItem.id = hash;
    constructorItem.title = title;
    constructorItem.description = description;
    constructorItem.variant = variant;

    constructorItem.category = new ConstructorCategory();
    constructorItem.category.id = category;

    await S3.client.putObject({
      Bucket: S3.BUCKET_NAME,
      Key: constructorItem.s3_key,
      Body: fileBinary,
      ContentType: file.type,
    });

    await this.constructorItemRepository.save(constructorItem);

    return this.constructorItemRepository.findOneOrFail({
      where: {
        id: hash,
      },
    });
  }
}
