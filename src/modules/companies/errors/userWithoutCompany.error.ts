import { BadRequestException } from '@nestjs/common';

export class UserWithoutCompanyError extends BadRequestException {
  constructor() {
    super('User do not have company');
  }
}
