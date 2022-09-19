import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';

export const SysPreferenceUI: {
  [key in SysPreference]: {
    name: string;
    helpText: string;
    category: string;
  };
} = {
  [SysPreference.HostOverride]: {
    name: 'Host Override',
    helpText:
      'Override the hostname for the server, useful for when you are accessing the server from a different domain.',
    category: 'General',
  },

  [SysPreference.RemoveDerivativesAfter]: {
    name: 'Cached Images Expiry Time',
    helpText:
      'Time before cached converted images are deleted. This does not affect the original image. A lower cache time will save on disk space but cost more cpu. Set to 0 to disable.',
    category: 'Image Processing',
  },
  [SysPreference.AllowEditing]: {
    name: 'Allow images to be edited',
    helpText:
      'Allow images to be edited (e.g. resize, flip). Using these features will use more CPU power.',

    category: 'Image Processing',
  },
  [SysPreference.ConversionTimeLimit]: {
    name: 'Convert/Edit Time Limit',
    helpText:
      'Time limit for converting/editing images. You may need to increase this on low powered devices.',
    category: 'Image Processing',
  },
  [SysPreference.ConversionMemoryLimit]: {
    name: 'Convert/Edit Memory Limit MB',
    helpText:
      'Memory limit for converting/editing images. You only need to increase this if you are storing massive images.',
    category: 'Image Processing',
  },

  [SysPreference.JwtSecret]: {
    name: 'JWT Secret',
    helpText: 'Secret used to sign JWT authentication tokens.',
    category: 'Authentication',
  },
  [SysPreference.JwtExpiresIn]: {
    name: 'JWT Expiry Time',
    helpText: 'Time before JWT authentication tokens expire.',
    category: 'Authentication',
  },
  [SysPreference.BCryptStrength]: {
    name: 'BCrypt Strength',
    helpText:
      'Strength of BCrypt hashing algorithm, 10 is recommended. Reduce this if running on a low powered device.',
    category: 'Authentication',
  },

  [SysPreference.EnableTracking]: {
    name: 'Enable Ackee Web Tracking',
    helpText:
      'Enable tracking of the website usage using Ackee. You will need to set the tracking URL and ID.',
    category: 'Usage',
  },
  [SysPreference.TrackingUrl]: {
    name: 'Ackee tracking URL',
    helpText:
      'URL of the Ackee tracking server. Requests are proxied, so ensure the X-Forwarded-For header is handled.',
    category: 'Usage',
  },
  [SysPreference.TrackingId]: {
    name: 'Ackee trackign website ID',
    helpText: 'ID of the website to track.',
    category: 'Usage',
  },

  [SysPreference.EnableTelemetry]: {
    name: 'Enable System Telemetry',
    helpText:
      'Enable system telemetry, this will send anonymous usage data to the developers.',
    category: 'Usage',
  },
};
