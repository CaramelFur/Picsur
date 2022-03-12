import { Exclude } from 'class-transformer';
import {
  IsArray, IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { Roles } from '../dto/roles.dto';

export class EUser {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  username: string;

  @IsArray()
  @IsString({ each: true })
  roles: Roles;

  @IsOptional()
  @Exclude()
  password?: string;
}
