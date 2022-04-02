import { IsHash, IsOptional, IsString } from 'class-validator';
import { IsEntityID } from '../validators/entity-id.validator';
import { IsNotDefined } from '../validators/not-defined.validator';

export class EImage {
  @IsOptional()
  @IsEntityID()
  id?: string;

  @IsHash('sha256')
  hash: string;

  // Because typescript does not support exact types, we have to do this stupidness
  @IsNotDefined()
  data: undefined;

  @IsString()
  mime: string;
}
