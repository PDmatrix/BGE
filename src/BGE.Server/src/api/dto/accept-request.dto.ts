import { IsString } from 'class-validator';

export class AcceptRequest {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly gameToken: string;
}
