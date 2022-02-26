import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { EUser } from '../entities/user.entity';
import { Type } from 'class-transformer';

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
  access_token: string;
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
