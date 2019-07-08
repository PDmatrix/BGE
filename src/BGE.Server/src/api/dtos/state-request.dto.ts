import { IsString } from 'class-validator';

export class StateRequest {
  @IsString()
  readonly userId: string;
}
