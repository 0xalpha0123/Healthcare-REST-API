import { BadRequestException } from '@nestjs/common';

export class UserHaveCompanyError extends BadRequestException {
  constructor() {
    super('User already have company');
  }
}