import { z } from 'zod';
import { Hono } from 'hono';
import { zValidator } from '@skinner/hono';

const app = new Hono().get(
  '/',
  zValidator(
    'query',
    z.object({
      name: z
        .string({
          description: 'Minecraft name',
        })
        .min(1)
        .max(16)
        .optional(),
    }),
  ),
  (context) => {
    const { name } = context.req.valid('query');

    console.log(context.get('jwtPayload'));

    return context.json({});
  },
);

export default app;

export * from './error';
