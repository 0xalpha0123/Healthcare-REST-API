import { ConnectionOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'mailgun':
        return {
          apiKey: 'apikey',
          domain: 'domain',
        };
    }
  },
};

export const mockedDb = (
  entities,
): ConnectionOptions | TypeOrmModuleOptions => ({
  type: 'postgres',
  host: 'localhost',
  port: 5555,
  username: 'test-user-nest',
  password: 'test-password-nest',
  database: 'test-database-nest',
  synchronize: true,
  entities,
  migrations: ['dist/migrations/**/*{.ts,.js}'],
  cli: { migrationsDir: 'src/migrations' },
  dropSchema: true,
  keepConnectionAlive: true,
})