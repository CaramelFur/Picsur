import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Permissions, PermissionsList } from '../dto/permissions';
import { EntityID } from '../validators/entity-id.validator';

export class ERole {
  @EntityID()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsEnum(PermissionsList, { each: true })
  permissions: Permissions;
}
