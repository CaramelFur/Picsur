import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class User {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsBoolean()
  isAdmin: boolean;
}
