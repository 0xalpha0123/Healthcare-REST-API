import { UnauthorizedException } from '@nestjs/common';

export class IncorrectTokenError extends UnauthorizedException {
  constructor() {
    super('Incorrect verificationToken');
  }
}
