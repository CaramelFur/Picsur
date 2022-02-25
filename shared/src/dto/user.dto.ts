import { IsBoolean, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class User {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsDefined()
  @IsBoolean()
  isAdmin: boolean;
}
