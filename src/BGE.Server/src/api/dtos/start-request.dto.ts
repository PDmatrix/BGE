import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class StartRequest {
  @ApiModelProperty()
  @IsString()
  readonly userId: string;

  @ApiModelProperty({
    default: 8,
    required: false,
    minimum: 6,
    maximum: 15,
  })
  @IsOptional()
  @IsNumber()
  @Min(6)
  @Max(15)
  readonly rows: number = 8;

  @ApiModelProperty({
    default: 8,
    required: false,
    minimum: 6,
    maximum: 15,
  })
  @IsOptional()
  @IsNumber()
  @Min(6, {
    message: 'This value is too small',
  })
  @Max(15)
  readonly cols: number = 8;
}
