import { createZodDto } from 'nestjs-zod';

import { UserSchema } from '../schema/user.schema';

export class UserDto extends createZodDto(UserSchema) {}
