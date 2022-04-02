import { IsOptional } from 'class-validator';
import { IsEntityID } from '../validators/entity-id.validator';
import { IsRoleName } from '../validators/role.validators';
import { IsStringList } from '../validators/string-list.validator';

export class SimpleRole {
  @IsRoleName()
  name: string;

  @IsStringList()
  permissions: string[];
}

export class ERole {
  @IsOptional()
  @IsEntityID()
  id?: string;

  @IsRoleName()
  name: string;

  @IsStringList()
  permissions: string[];
}
