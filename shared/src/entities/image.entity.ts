import { Exclude } from 'class-transformer';
import { IsDefined, IsEnum, IsHash, IsInt, IsOptional } from 'class-validator';
import { SupportedMime, SupportedMimes } from '../dto/mimes.dto';

export class EImage {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsHash('sha256')
  hash: string;

  // Binary data
  @IsOptional()
  @Exclude()
  data?: object;

  @IsEnum(SupportedMimes)
  @IsDefined()
  mime: SupportedMime;
}
