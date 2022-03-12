import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Permissions, PermissionsList } from '../dto/permissions';

export class ERole {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsEnum(PermissionsList, { each: true })
  permissions: Permissions;
}
