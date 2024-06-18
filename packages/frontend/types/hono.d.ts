import 'hono/client';
import type { ErrorCode } from '@skinner/backend';

type BlankRecordToNever<T> = T extends any ? (keyof T extends never ? never : T) : never;

declare module 'hono/client' {
  export interface ClientResponse<T> {
    json(): Promise<
      BlankRecordToNever<T> & {
        error?: {
          code: ErrorCode;
          message: string;
        };
      }
    >;
  }
}
