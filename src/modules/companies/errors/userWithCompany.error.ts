import { BadRequestException } from '@nestjs/common';

export class UserWithCompanyError extends BadRequestException {
  constructor() {
    super('User already have company');
  }
}
