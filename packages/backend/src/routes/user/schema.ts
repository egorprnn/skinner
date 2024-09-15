import { z } from 'zod';
import { userSchema } from '../../db/entities/user/schema';

export const userGetSchema = z.union([
  z.object({ uuid: userSchema.shape.uuid }),
  z.object({ name: userSchema.shape.name }),
]);
