import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { User } from 'src/collections/userdb/user.dto';

export class LoginResponseDto {
  @IsString()
  @IsDefined()
  access_token: string;
}

export class RegisterRequestDto {
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

export class DeleteRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class JwtDataDto {
  @ValidateNested()
  @IsDefined()
  user: User;
}
