import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';

export const SysPreferenceUI: {
  [key in SysPreference]: {
    name: string;
    helpText: string;
    category: string;
  };
} = {
  [SysPreference.HostOverride]: {
    name: 'systemPreferences.hostOverride.name',
    helpText: 'systemPreferences.hostOverride.helpText',
    category: 'systemPreferences.categories.general',
  },

  [SysPreference.RemoveDerivativesAfter]: {
    name: 'systemPreferences.removeDerivativesAfter.name',
    helpText: 'systemPreferences.removeDerivativesAfter.helpText',
    category: 'systemPreferences.categories.imageProcessing',
  },
  [SysPreference.AllowEditing]: {
    name: 'systemPreferences.allowEditing.name',
    helpText: 'systemPreferences.allowEditing.helpText',

    category: 'systemPreferences.categories.imageProcessing',
  },
  [SysPreference.ConversionTimeLimit]: {
    name: 'systemPreferences.conversionTimeLimit.name',
    helpText: 'systemPreferences.conversionTimeLimit.helpText',
    category: 'systemPreferences.categories.imageProcessing',
  },
  [SysPreference.ConversionMemoryLimit]: {
    name: 'systemPreferences.conversionMemoryLimit.name',
    helpText: 'systemPreferences.conversionMemoryLimit.helpText',
    category: 'systemPreferences.categories.imageProcessing',
  },

  [SysPreference.JwtSecret]: {
    name: 'systemPreferences.jwtSecret.name',
    helpText: 'systemPreferences.jwtSecret.helpText',
    category: 'systemPreferences.categories.authentication',
  },
  [SysPreference.JwtExpiresIn]: {
    name: 'systemPreferences.jwtExpiresIn.name',
    helpText: 'systemPreferences.jwtExpiresIn.helpText',
    category: 'systemPreferences.categories.authentication',
  },
  [SysPreference.BCryptStrength]: {
    name: 'systemPreferences.bcryptStrength.name',
    helpText: 'systemPreferences.bcryptStrength.helpText',
    category: 'systemPreferences.categories.authentication',
  },

  [SysPreference.EnableTracking]: {
    name: 'systemPreferences.enableTracking.name',
    helpText: 'systemPreferences.enableTracking.helpText',
    category: 'systemPreferences.categories.usage',
  },
  [SysPreference.TrackingUrl]: {
    name: 'systemPreferences.trackingUrl.name',
    helpText: 'systemPreferences.trackingUrl.helpText',
    category: 'systemPreferences.categories.usage',
  },
  [SysPreference.TrackingId]: {
    name: 'systemPreferences.trackingId.name',
    helpText: 'systemPreferences.trackingId.helpText',
    category: 'systemPreferences.categories.usage',
  },

  [SysPreference.EnableTelemetry]: {
    name: 'systemPreferences.enableTelemetry.name',
    helpText: 'systemPreferences.enableTelemetry.helpText',
    category: 'systemPreferences.categories.usage',
  },
};
