import { Hono } from 'hono';
import { zValidator } from '@skinner/hono';

import { constructorCreateSchema } from './schema';

const app = new Hono().put('/', zValidator('form', constructorCreateSchema), async (context) => {
  const form = await context.req.valid('form');

  // console.log(form);
});

export default app;
