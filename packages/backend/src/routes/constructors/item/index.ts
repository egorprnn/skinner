import crypto from 'crypto';
import { Hono } from 'hono';
import { zValidator } from '@skinner/hono';

import { constructorsItemPutSchema } from './schema';
import { ConstructorCategory, ConstructorItem, constructorItemRepository } from '../../../db';

const app = new Hono().put('/', zValidator('form', constructorsItemPutSchema), async (context) => {
  const { title, description, variant, category, file } = await context.req.valid('form');

  const hash = crypto
    .createHash('sha256')
    .update(Buffer.from(await file.arrayBuffer()))
    .digest('hex');

  let constructorItem = await constructorItemRepository.findOne({
    where: {
      id: hash,
    },
  });

  if (constructorItem) {
    return context.json(constructorItem);
  }

  constructorItem = new ConstructorItem();

  constructorItem.id = hash;
  constructorItem.title = title;
  constructorItem.description = description;
  constructorItem.variant = variant;
  constructorItem['file'] = file;

  constructorItem.category = new ConstructorCategory();
  constructorItem.category.id = category;

  await constructorItemRepository.save(constructorItem);

  constructorItem =
    (await constructorItemRepository.findOne({
      where: {
        id: hash,
      },
    })) || constructorItem;

  return context.json(constructorItem);
});

export default app;
