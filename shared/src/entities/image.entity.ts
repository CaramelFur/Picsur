import { Exclude } from 'class-transformer';
import { IsHash, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EntityID } from '../validators/entity-id.validator';

export class EImage {
  @EntityID()
  id: string;

  @IsHash('sha256')
  hash: string;

  // Binary data
  @IsOptional()
  @Exclude() // Dont send this by default
  data?: object;
  
  @IsNotEmpty()
  @IsString()
  mime: string;
}
