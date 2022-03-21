import { Exclude } from 'class-transformer';
import {
  IsAlphanumeric,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length
} from 'class-validator';
import { Roles } from '../dto/roles.dto';

// Match this with user validators in frontend
// (Not security focused, but it tells the user what is wrong)

export class SimpleUsername {
  @IsNotEmpty()
  @IsString()
  @Length(4, 32)
  @IsAlphanumeric()
  username: string;
}

// This is a simple user object with just the username and unhashed password
export class SimpleUser extends SimpleUsername {
  @IsNotEmpty()
  @IsString()
  @Length(4, 1024)
  password: string;
}

// Add a user object with just the username and roles for jwt
export class RoledUser extends SimpleUsername {
  @IsArray()
  @IsString({ each: true })
  roles: Roles;
}

// Actual entity that goes in the db
export class EUser extends RoledUser {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @Exclude()
  @IsString()
  password?: string;
}
