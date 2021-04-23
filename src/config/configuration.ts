import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { DbConfig } from './db-configuration';

export interface JSONWebTokenConfig {
  secret: string;
  signOptions: {
    expiresIn: number;
  };
}

export interface AWSConfig {
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  bucket: {
    name: string;
  };
  region: string;
}

export interface MailgunConfig {
  apiKey: string,
  domain: string
}


export interface ConfigI {
  database: ConnectionOptions | TypeOrmModuleOptions;
  jwt: JSONWebTokenConfig;
  aws: AWSConfig;
  mailgun: MailgunConfig;
}

export default (): ConfigI => ({
  database: DbConfig,
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: 3600,
    },
  },
  aws: {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    bucket: {
      name: process.env.S3_BUCKET_NAME,
    },
    region: 'eu-west-2',
  },
  mailgun: {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
  }
});
