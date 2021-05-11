import { BadRequestException } from '@nestjs/common';

export class IncorrectTrPaidError extends BadRequestException {
  constructor() {
    super('Incorrect tr_paid value');
  }
}
