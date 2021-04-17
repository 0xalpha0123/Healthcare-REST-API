import path from 'path';
import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const dotenvPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: dotenvPath });

export const SeedConfig: ConnectionOptions | TypeOrmModuleOptions = {
  name: 'seed',
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrations: [
      'src/seeders/*.ts'
  ],
  cli: {
      migrationsDir: 'src/seeders',
  },
  logging: true,
};



export const DbConfig: ConnectionOptions | TypeOrmModuleOptions = {
  name: 'default',
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  synchronize: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/**/*{.ts,.js}'],
  cli: { migrationsDir: 'src/migrations' },
  logging: true,
};

export default [DbConfig, SeedConfig];
