import { BadRequestException } from '@nestjs/common';

export class CrcNotFoundError extends BadRequestException {
  constructor() {
    super('Payment with provided crc not found');
  }
}
