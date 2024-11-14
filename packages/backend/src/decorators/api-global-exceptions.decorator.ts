import { ApiException } from './api-exception.decorator';

import { JWTTokenType } from '../routes/auth/dto/auth.dto';
import { AppInternalException } from '../error/app-internal.error';
import { AppValidationException } from '../error/app-validation.error';
import { AppUnknownMethodException } from '../error/app-unknown-method.error';
import { AuthInvalidTokenException } from '../routes/auth/error/auth-invalid-token.error';
import { AuthRequiredAuthException } from '../routes/auth/error/auth-required-auth.error';
import { AuthInvalidTokenTypeException } from '../routes/auth/error/auth-invalid-token-type.error';

export const ApiGlobalExceptions = ApiException.bind(ApiException, () => [
  AppUnknownMethodException,
  new AppInternalException('Internal exception message'),
  new AppValidationException('example_field: Required, example_field: Input not instance of File'),

  AuthRequiredAuthException,
  new AuthInvalidTokenException(JWTTokenType.ACCESS_TOKEN),
  new AuthInvalidTokenTypeException(JWTTokenType.REFRESH_TOKEN, JWTTokenType.ACCESS_TOKEN),
]);
