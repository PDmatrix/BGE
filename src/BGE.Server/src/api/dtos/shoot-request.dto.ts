import { IsNumber, IsString } from 'class-validator';

export class ShootRequest {
  @IsNumber()
  readonly x: number;

  @IsNumber()
  readonly y: number;

  @IsString()
  readonly userId: string;
}
