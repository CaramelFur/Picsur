import { Exclude } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class EUser {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  username: string;

  @IsDefined()
  isAdmin: boolean;

  @IsOptional()
  @Exclude()
  password?: string;
}
