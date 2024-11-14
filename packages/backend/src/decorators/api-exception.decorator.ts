import { buildTemplatedApiExceptionDecorator } from '@nanogiants/nestjs-swagger-api-exception-decorator';

export const ApiException = buildTemplatedApiExceptionDecorator({
  error: {
    code: '$error',
    message: '$description',
  },
});
