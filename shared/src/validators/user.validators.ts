import { IsAlphanumeric, IsNotEmpty, IsString, Length } from 'class-validator';
import { CombinePDecorators } from '../util/decorator';

// Match this with user validators in frontend
// (Frontend is not security focused, but it tells the user what is wrong)

export const IsUsername = CombinePDecorators(
  IsNotEmpty(),
  IsString(),
  Length(4, 32),
  IsAlphanumeric(),
);

export const IsPlainTextPwd = CombinePDecorators(
  IsNotEmpty(),
  IsString(),
  Length(4, 1024),
);
