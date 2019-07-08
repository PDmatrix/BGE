import { IsArray } from 'class-validator';

export class CleanseResponse {
  @IsArray()
  readonly field: string[][];
}
