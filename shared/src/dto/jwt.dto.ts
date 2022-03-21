import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { RoledUser } from '../entities/user.entity';

export class JwtDataDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => RoledUser)
  user: RoledUser;

  @IsOptional()
  @IsInt()
  iat?: number;

  @IsOptional()
  @IsInt()
  exp?: number;
}
