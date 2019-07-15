import { IsBoolean } from 'class-validator';

export class ShootResponse {
  @IsBoolean()
  isHit: boolean;

  field: string[][];
}
