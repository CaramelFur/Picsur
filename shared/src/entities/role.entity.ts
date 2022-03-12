import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Permissions, PermissionsList } from '../dto/permissions';

export class ERole {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsEnum(PermissionsList, { each: true })
  permissions: Permissions;
}
