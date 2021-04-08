import { Coordinates } from '../interfaces/coordinates.interface';
import { ValueTransformer } from 'typeorm';

export class PointTransformer implements ValueTransformer {
  to(value: Coordinates) {
    const { x, y } = value;
    return `${x}, ${y}`;
  }

  from(value): Coordinates {
    if (!value) {
      return;
    }
    const { x, y } = value;
    return { x, y };
  }
}
