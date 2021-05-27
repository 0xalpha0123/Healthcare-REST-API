import { ApiProperty } from '@nestjs/swagger';

export interface File {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
