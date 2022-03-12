import { Type } from 'class-transformer';
import {
  IsArray, IsBoolean,
  IsDefined, IsEnum, IsInt, IsNotEmpty,
  IsOptional,
  IsString, ValidateNested
} from 'class-validator';
import { EUser } from '../entities/user.entity';
import { Permissions, PermissionsList } from './permissions';

// Api

export class AuthLoginRequest {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AuthLoginResponse {
  @IsString()
  @IsDefined()
  jwt_token: string;
}

export class AuthRegisterRequest {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}

export class AuthDeleteRequest {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class AuthDeleteResponse extends EUser {}

export class AuthMeResponse {
  @IsDefined()
  @ValidateNested()
  @Type(() => EUser)
  user: EUser;

  @IsDefined()
  @IsArray()
  @IsEnum(PermissionsList, { each: true })
  permissions: Permissions;

  @IsString()
  @IsDefined()
  newJwtToken: string;
}

// Extra

export class JwtDataDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => EUser)
  user: EUser;

  @IsOptional()
  @IsInt()
  iat?: number;

  @IsOptional()
  @IsInt()
  exp?: number;
}
