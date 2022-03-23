import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { NameRolesUser } from '../entities/user.entity';

export class JwtDataDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => NameRolesUser)
  user: NameRolesUser;

  @IsOptional()
  @IsInt()
  iat?: number;

  @IsOptional()
  @IsInt()
  exp?: number;
}
