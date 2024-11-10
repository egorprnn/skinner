import { AuthAccessTokenUserDto } from '../src/routes/auth/dto/auth-access-token-user.dto';

declare module 'hono' {
  interface HonoRequest {
    user?: AuthAccessTokenUserDto;
  }
}
