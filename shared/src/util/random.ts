import { randomInt } from 'crypto';

const randomCharacters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateRandomString(length: number): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    // Yes this is done synchronously, but it's not a big deal
    out += randomCharacters[randomInt(0, randomCharacters.length - 1)];
  }
  return out;
}
