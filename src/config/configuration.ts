import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import DbConfig from './db-configuration';

export interface JSONWebTokenConfig {
  secret: string;
  signOptions: {
    expiresIn: number;
  };
}

export interface ConfigI {
  database: ConnectionOptions | TypeOrmModuleOptions;
  jwt: JSONWebTokenConfig;
}

export default (): ConfigI => ({
  database: DbConfig,
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: 3600,
    },
  },
});
