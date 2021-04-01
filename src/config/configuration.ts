import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';

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
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: 3600,
    },
  },
});
