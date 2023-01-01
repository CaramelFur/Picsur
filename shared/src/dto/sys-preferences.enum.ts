import { z } from 'zod';
import { URLRegex } from '../util/common-regex';
import { IsEntityID } from '../validators/entity-id.validator';
import { IsValidMS } from '../validators/ms.validator';
import { IsPosInt } from '../validators/positive-int.validator';
import { PrefValueTypeStrings } from './preferences.dto';

// This enum is only here to make accessing the values easier, and type checking in the backend
export enum SysPreference {
  HostOverride = 'host_override',

  JwtSecret = 'jwt_secret',
  JwtExpiresIn = 'jwt_expires_in',
  BCryptStrength = 'bcrypt_strength',

  RemoveDerivativesAfter = 'remove_derivatives_after',
  AllowEditing = 'allow_editing',

  ConversionTimeLimit = 'conversion_time_limit',
  ConversionMemoryLimit = 'conversion_memory_limit',

  FSLocalPath = 'fs_local_path',
  FSS3Endpoint = 'fs_s3_endpoint',
  FSS3Bucket = 'fs_s3_bucket',
  FSS3Region = 'fs_s3_region',
  FSS3AccessKey = 'fs_s3_access_key',
  FSS3SecretKey = 'fs_s3_secret_key',

  EnableTracking = 'enable_tracking',
  TrackingUrl = 'tracking_url',
  TrackingId = 'tracking_id',

  EnableTelemetry = 'enable_telemetry',
}

export type SysPreferences = SysPreference[];
export const SysPreferenceList: string[] = Object.values(SysPreference);

// Syspref Value types
export const SysPreferenceValueTypes: {
  [key in SysPreference]: PrefValueTypeStrings;
} = {
  [SysPreference.HostOverride]: 'string',

  [SysPreference.JwtSecret]: 'string',
  [SysPreference.JwtExpiresIn]: 'string',
  [SysPreference.BCryptStrength]: 'number',

  [SysPreference.RemoveDerivativesAfter]: 'string',
  [SysPreference.AllowEditing]: 'boolean',

  [SysPreference.ConversionTimeLimit]: 'string',
  [SysPreference.ConversionMemoryLimit]: 'number',

  [SysPreference.FSLocalPath]: 'string',
  [SysPreference.FSS3Endpoint]: 'string',
  [SysPreference.FSS3Bucket]: 'string',
  [SysPreference.FSS3Region]: 'string',
  [SysPreference.FSS3AccessKey]: 'string',
  [SysPreference.FSS3SecretKey]: 'string',

  [SysPreference.EnableTracking]: 'boolean',
  [SysPreference.TrackingUrl]: 'string',
  [SysPreference.TrackingId]: 'string',

  [SysPreference.EnableTelemetry]: 'boolean',
};

export const SysPreferenceValidators: {
  [key in SysPreference]: z.ZodTypeAny;
} = {
  [SysPreference.HostOverride]: z.string().regex(URLRegex).or(z.literal('')),

  [SysPreference.JwtSecret]: z.string(),
  [SysPreference.JwtExpiresIn]: IsValidMS(),

  [SysPreference.BCryptStrength]: IsPosInt(),
  [SysPreference.RemoveDerivativesAfter]: IsValidMS(60000),

  [SysPreference.AllowEditing]: z.boolean(),
  [SysPreference.ConversionTimeLimit]: IsValidMS(),
  [SysPreference.ConversionMemoryLimit]: IsPosInt(),

  [SysPreference.FSLocalPath]: z.string(),
  [SysPreference.FSS3Endpoint]: z.string().regex(URLRegex).or(z.literal('')),
  [SysPreference.FSS3Bucket]: z.string(),
  [SysPreference.FSS3Region]: z.string(),
  [SysPreference.FSS3AccessKey]: z.string(),
  [SysPreference.FSS3SecretKey]: z.string(),

  [SysPreference.EnableTracking]: z.boolean(),
  [SysPreference.TrackingUrl]: z.string().regex(URLRegex).or(z.literal('')),
  [SysPreference.TrackingId]: IsEntityID().or(z.literal('')),

  [SysPreference.EnableTelemetry]: z.boolean(),
};
