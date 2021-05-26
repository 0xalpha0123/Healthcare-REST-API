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
  apiKey: string;
  domain: string;
  host: string;
}

export interface TpayConfig {
  url: string;
  id: string;
  api_password: string;
  api_key: string;
  security_code: string;
  result_url: string;
  result_email: string;
  return_url: string;
  return_error_url: string;
}

export interface ConfigI {
  database: ConnectionOptions | TypeOrmModuleOptions;
  jwt: JSONWebTokenConfig;
  aws: AWSConfig;
  mailgun: MailgunConfig;
  tpay: TpayConfig;
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
    domain: process.env.MAILGUN_DOMAIN,
    host: "api.eu.mailgun.net"
  },
  tpay: {
    url: process.env.TPAY_API_URL,
    id: process.env.TPAY_ID,
    api_password: process.env.TPAY_API_PASSWORD,
    api_key: process.env.TPAY_API_KEY,
    security_code: process.env.TPAY_SECURITY_CODE,
    result_url: process.env.TPAY_RESULT_URL,
    result_email: process.env.TPAY_RESULT_EMAIL,
    return_url: process.env.TPAY_RETURN_URL,
    return_error_url: process.env.TPAY_RETURN_ERROR_URL,
  },
});
