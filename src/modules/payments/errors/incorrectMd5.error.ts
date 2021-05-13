import { BadRequestException } from '@nestjs/common';

export class IncorrectMd5Error extends BadRequestException {
  constructor() {
    super('Incorrect md5sum value');
  }
}
