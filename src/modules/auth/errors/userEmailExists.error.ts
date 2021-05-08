import { BadRequestException } from '@nestjs/common';

export class UserEmailExistsError extends BadRequestException {
  constructor() {
    super('Email already exists');
  }
}