import { IsOptional } from 'class-validator';
import { IsEntityID } from '../validators/entity-id.validator';
import { IsNotDefined } from '../validators/not-defined.validator';
import { IsStringList } from '../validators/string-list.validator';
import { IsPlainTextPwd, IsUsername } from '../validators/user.validators';

export class SimpleUser {
  @IsUsername()
  username: string;

  @IsPlainTextPwd()
  password: string;

  @IsStringList()
  roles: string[];
}

export class EUser {
  @IsOptional()
  @IsEntityID()
  id?: string;

  @IsUsername()
  username: string;

  @IsStringList()
  roles: string[];

  // Because typescript does not support exact types, we have to do this stupidness
  @IsNotDefined()
  hashedPassword: undefined;
}
