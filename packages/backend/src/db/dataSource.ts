import { DataSource } from 'typeorm';
import { IS_DEVELOPMENT_MODE } from '@skinner/constants';

import { entities } from './entities';
import { migrations } from './migrations';
import { subscribers } from './subscribers';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'],
  port: Number(process.env['DB_PORT']),
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_NAME'],
  synchronize: true,
  logging: IS_DEVELOPMENT_MODE,
  entities,
  migrations,
  subscribers,
});
