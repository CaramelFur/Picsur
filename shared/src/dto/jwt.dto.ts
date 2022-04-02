import { IsInt, IsOptional } from 'class-validator';
import { EUser } from '../entities/user.entity';
import { IsNested } from '../validators/nested.validator';

export class JwtDataDto {
  @IsNested(EUser)
  user: EUser;

  @IsOptional()
  @IsInt()
  iat?: number;

  @IsOptional()
  @IsInt()
  exp?: number;
}
