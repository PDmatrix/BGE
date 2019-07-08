import { IsArray } from 'class-validator';

export class StartResponse {
  @IsArray()
  field: string[][];
}
