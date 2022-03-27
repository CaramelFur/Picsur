import { Exclude } from 'class-transformer';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { EntityID } from '../validators/entity-id.validator';
import { IsStringList } from '../validators/string-list.validator';
import { IsPlainTextPwd, IsUsername } from '../validators/user.validators';

// This entity is build from multiple smaller enitities
// Theses smaller entities are used in other places

export class UsernameUser {
  @IsUsername()
  username: string;
}

// This is a simple user object with just the username and unhashed password
export class NamePassUser extends UsernameUser {
  @IsPlainTextPwd()
  password: string;
}

// Add a user object with just the username and roles for jwt
export class NameRolesUser extends UsernameUser {
  @IsDefined()
  @IsStringList()
  roles: string[];
}

// Actual entity that goes in the db
export class EUser extends NameRolesUser {
  @EntityID()
  id?: number;

  @IsOptional()
  @Exclude()
  @IsString()
  password?: string;
}
