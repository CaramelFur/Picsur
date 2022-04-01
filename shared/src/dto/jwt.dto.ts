import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { EUser } from '../entities/user.entity';

export class JwtDataDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => EUser)
  user: EUser;

  @IsOptional()
  @IsInt()
  iat?: number;

  @IsOptional()
  @IsInt()
  exp?: number;
}
