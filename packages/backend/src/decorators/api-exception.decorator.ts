import { buildTemplatedApiExceptionDecorator } from '@nanogiants/nestjs-swagger-api-exception-decorator';

export const ApiException = buildTemplatedApiExceptionDecorator({
  error: '$error',
  message: '$description',
});
