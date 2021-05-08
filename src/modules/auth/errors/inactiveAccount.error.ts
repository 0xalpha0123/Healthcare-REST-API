import { UnauthorizedException } from '@nestjs/common';

export class InactiveAccountError extends UnauthorizedException {
  constructor() {
    super('Inactive account');
  }
}