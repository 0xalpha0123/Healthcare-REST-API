import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as config from 'config';

const dbConfig = config.get('db');
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.DB_HOSTNAME || dbConfig.host,
  port:process.env.DB_PORT || dbConfig.port,
  username: process.env.DB_USERNAME|| dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_NAME || dbConfig.database,
  autoLoadEntities: true,
  synchronize: dbConfig.synchronize
}