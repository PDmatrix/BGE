import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AcceptRequest {
  @ApiModelProperty()
  @IsString()
  readonly userId: string;

  @ApiModelProperty()
  @IsString()
  readonly gameToken: string;
}
