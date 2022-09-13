// This enum is only here to make accessing the values easier, and type checking in the backend
export enum SysPreference {
  JwtSecret = 'jwt_secret',
  JwtExpiresIn = 'jwt_expires_in',
  BCryptStrength = 'bcrypt_strength',

  SaveDerivatives = 'save_derivatives',
  RemoveDerivativesAfter = 'remove_derivatives_after',
  AllowEditing = 'allow_editing',

  ConversionTimeLimit = 'conversion_time_limit',
  ConversionMemoryLimit = 'conversion_memory_limit',

  TrackingUrl = 'tracking_url',
  TrackingId = 'tracking_id',
}
