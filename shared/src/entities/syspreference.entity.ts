import { IsNotEmpty, IsOptional } from 'class-validator';

export class ESysPreference {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  value: string;
}
