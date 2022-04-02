
// This enum is only here to make accessing the values easier, and type checking in the backend
export enum SysPreference {
  JwtSecret = 'jwt_secret',
  JwtExpiresIn = 'jwt_expires_in',
  BCryptStrength = 'bcrypt_strength',
  TestString = 'test_string',
  TestNumber = 'test_number',
  TestBoolean = 'test_boolean',
}
