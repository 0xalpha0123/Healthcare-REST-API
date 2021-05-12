import { BadRequestException } from '@nestjs/common';

export class LocationNotAssignedToCompanyError extends BadRequestException {
  constructor() {
    super('User cannot delete location of other company');
  }
}
