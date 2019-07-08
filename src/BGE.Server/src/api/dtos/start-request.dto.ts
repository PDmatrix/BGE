import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class StartRequest {
  @IsString()
  readonly userId: string;

  @IsOptional()
  @IsNumber()
  @Min(6)
  @Max(15)
  readonly rows: number = 8;

  @IsOptional()
  @IsNumber()
  @Min(6)
  @Max(15)
  readonly cols: number = 8;
}
