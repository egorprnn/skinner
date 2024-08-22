import { Hono } from 'hono';
import { IsNull } from 'typeorm';

import { constructorCategoryRepository } from '../../../db';

const app = new Hono().get('/', async (context) => {
  const categories = await constructorCategoryRepository.find({
    where: { parent: IsNull() },
    relations: ['children'],
  });

  return context.json(categories);
});

export default app;
