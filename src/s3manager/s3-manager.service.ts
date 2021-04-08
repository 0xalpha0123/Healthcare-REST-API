import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { AWSConfig } from '../config/configuration';
import * as crypto from 'crypto';
import path from 'path';
import { File } from '../common/interfaces/file.interface';

export type S3AllowedFolders = 'photos' | 'cvs' | 'logos';

@Injectable()
export class S3ManagerService {
  private awsConfig: AWSConfig;

  constructor(
    @InjectAwsService(S3) private readonly s3: S3,
    private readonly configService: ConfigService,
  ) {
    this.awsConfig = this.configService.get('aws');
  }

  private getExtension(fileName: string) {
    return path.extname(fileName);
  }

  private generateFileName(): string {
    return crypto.randomBytes(10).toString('hex');
  }

  private getKeyFromFilePath(filePath: string) {
    const re = /.amazonaws.com\/(.*)/;
    return filePath.match(re)[1];
  }

  uploadFile(folder: S3AllowedFolders, file: File) {
    return this.s3
      .upload({
        Bucket: this.awsConfig.bucket.name,
        Body: file.buffer,
        Key:
          `${folder}/${this.generateFileName()}` +
          this.getExtension(file.originalname),
      })
      .promise();
  }

  async removeFile(fileLocation: string) {
    return this.s3
      .deleteObject({
        Bucket: this.awsConfig.bucket.name,
        Key: this.getKeyFromFilePath(fileLocation),
      })
      .promise();
  }
}
