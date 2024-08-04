import type { RequestPresigningArguments } from '@smithy/types';

export interface S3CreatePresignedUrlOptions extends RequestPresigningArguments {
  key: string;
}
