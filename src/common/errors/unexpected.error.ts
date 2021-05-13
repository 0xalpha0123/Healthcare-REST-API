import { BadRequestException } from '@nestjs/common';

export class UnexpectedError extends BadRequestException {
  constructor() {
    super('Unexpected error');
  }
}
