import { IsBoolean } from 'class-validator';

export class ShootResponse {
  @IsBoolean()
  isHit: boolean;

  @IsBoolean()
  isWinner: boolean;

  field: string[][];
}
