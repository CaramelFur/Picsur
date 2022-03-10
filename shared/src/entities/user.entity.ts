import { Exclude } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Roles, RolesList } from '../dto/roles.dto';

export class EUser {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  username: string;

  @IsArray()
  @IsEnum(RolesList, { each: true })
  roles: Roles;

  @IsOptional()
  @Exclude()
  password?: string;
}
