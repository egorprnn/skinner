import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, S3 as S3Client, waitUntilBucketExists } from '@aws-sdk/client-s3';

import type { S3CreatePresignedUrlOptions } from './types';
import { SITE_URL } from '@skinner/constants';

export class S3 {
  static readonly BUCKET_NAME = process.env['S3_BUCKET'];

  static readonly client = new S3Client({
    endpoint: process.env['S3_ENDPOINT'],
    apiVersion: 'latest',
    credentials: {
      accessKeyId: process.env['S3_ACCESS_KEY']!,
      secretAccessKey: process.env['S3_SECRET_KEY']!,
    },
    forcePathStyle: true,
    region: 'us-east-1',
  });

  static createPresignedUrl({ key, ...options }: S3CreatePresignedUrlOptions) {
    const expiresIn = 24 * 60 * 60; // 1 день, в секундах

    const command = new GetObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
      ResponseCacheControl: `public, max-age=${expiresIn}, immutable`,
    });

    return getSignedUrl(this.client, command, {
      expiresIn,
      ...options,
    });
  }
}

await S3.client
  .headBucket({
    Bucket: S3.BUCKET_NAME,
  })
  .catch(async () => {
    await S3.client.createBucket({ Bucket: S3.BUCKET_NAME });
    await S3.client.putBucketCors({
      Bucket: S3.BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET'],
            AllowedOrigins: [SITE_URL],
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    });

    return waitUntilBucketExists(
      {
        client: S3.client,
        maxWaitTime: 60,
      },
      {
        Bucket: S3.BUCKET_NAME,
      },
    );
  });
