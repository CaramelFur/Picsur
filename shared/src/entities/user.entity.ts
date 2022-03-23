import { Exclude } from 'class-transformer';
import {
  IsArray, IsOptional,
  IsString
} from 'class-validator';
import { Roles } from '../dto/roles.dto';
import { EntityID } from '../validators/entity-id.validator';
import { IsPlainTextPwd, IsUsername } from '../validators/user.validators';

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
  @IsArray()
  @IsString({ each: true })
  roles: Roles;
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
