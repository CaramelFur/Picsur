import { IsDefined } from 'class-validator';
import { EntityID } from '../validators/entity-id.validator';
import { IsRoleName } from '../validators/role.validators';
import { IsStringList } from '../validators/string-list.validator';

// This entity is build from multiple smaller enitities
// Theses smaller entities are used in other places

export class RoleNameObject {
  @IsRoleName()
  name: string;
}

export class RoleNamePermsObject extends RoleNameObject {
  @IsDefined()
  @IsStringList()
  permissions: string[];
}

export class ERole extends RoleNamePermsObject {
  @EntityID()
  id?: number;
}
