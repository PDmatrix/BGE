import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StateRequest {
  @ApiModelProperty()
  @IsString()
  readonly userId: string;
}
