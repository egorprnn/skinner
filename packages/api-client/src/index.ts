import { Fetcher } from 'openapi-typescript-fetch';

import type { paths } from './schema';

export const client = Fetcher.for<paths>();
