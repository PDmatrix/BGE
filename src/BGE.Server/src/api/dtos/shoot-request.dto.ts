import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ShootRequest {
  @ApiModelProperty()
  @IsNumber()
  readonly x: number;

  @ApiModelProperty()
  @IsNumber()
  readonly y: number;

  @ApiModelProperty()
  @IsString()
  readonly userId: string;

  @ApiModelProperty()
  @IsString()
  readonly gameToken: string;
}
