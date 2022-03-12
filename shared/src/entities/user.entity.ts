import { Exclude } from 'class-transformer';
import {
  IsArray, IsInt, IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { Roles } from '../dto/roles.dto';

export class EUser {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsArray()
  @IsString({ each: true })
  roles: Roles;

  @IsOptional()
  @Exclude()
  @IsString()
  password?: string;
}
