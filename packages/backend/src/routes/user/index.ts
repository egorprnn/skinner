import { Hono } from 'hono';
import { zValidator } from '@skinner/hono';

import { userGetSchema } from './schema';

const app = new Hono().get('/', zValidator('query', userGetSchema), (context) => {
  const query = context.req.valid('query');

  const uuid = 'uuid' in query ? query.uuid : undefined;
  const name = 'name' in query ? query.name : undefined;

  console.log(context.get('jwtPayload'), uuid, name);

  return context.json({});
});

export default app;
