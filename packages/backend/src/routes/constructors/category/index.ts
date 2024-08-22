import { Hono } from 'hono';
import { zValidator } from '@skinner/hono';

import { constructorCategoryPostSchema } from './schema';
import { ConstructorCategory, constructorCategoryRepository } from '../../../db';

const app = new Hono().post('/', zValidator('json', constructorCategoryPostSchema), async (context) => {
  const { id, parent } = context.req.valid('json');

  let constructorCategory = await constructorCategoryRepository.findOne({
    where: {
      id,
    },
    relations: ['parent', 'children'],
  });

  if (constructorCategory) {
    return context.json(constructorCategory);
  }

  constructorCategory = new ConstructorCategory();

  constructorCategory.id = id;

  if (parent) {
    constructorCategory.parent = new ConstructorCategory();
    constructorCategory.parent.id = parent;

    await constructorCategoryRepository.save(constructorCategory.parent);
  }

  await constructorCategoryRepository.save(constructorCategory);

  constructorCategory = await constructorCategoryRepository.findOne({
    where: {
      id,
    },
    relations: ['parent', 'children'],
  });

  return context.json(constructorCategory);
});

export default app;
