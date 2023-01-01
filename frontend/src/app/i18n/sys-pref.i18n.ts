import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';

export enum SysPreferenceCategory {
  General = 'general',
  Authentication = 'authentication',
  ImageProcessing = 'image-processing',
  FileStorage = 'file-storage',
  Usage = 'usage',
}

export const SysPreferenceCategories: {
  [key in SysPreferenceCategory]: string;
} = {
  [SysPreferenceCategory.General]: 'General',
  [SysPreferenceCategory.Authentication]: 'Authentication',
  [SysPreferenceCategory.ImageProcessing]: 'Image Processing',
  [SysPreferenceCategory.FileStorage]: 'File Storage',
  [SysPreferenceCategory.Usage]: 'Usage',
};

export const SysPreferenceUI: {
  [key in SysPreference]: {
    name: string;
    helpText: string;
    category: SysPreferenceCategory;
  };
} = {
  [SysPreference.HostOverride]: {
    name: 'Host Override',
    helpText:
      'Override the hostname for the server, useful for when you are accessing the server from a different domain.',
    category: SysPreferenceCategory.General,
  },

  [SysPreference.RemoveDerivativesAfter]: {
    name: 'Cached Images Expiry Time',
    helpText:
      'Time before cached converted images are deleted. This does not affect the original image. A lower cache time will save on disk space but cost more cpu. Set to 0 to disable.',
    category: SysPreferenceCategory.ImageProcessing,
  },
  [SysPreference.AllowEditing]: {
    name: 'Allow images to be edited',
    helpText:
      'Allow images to be edited (e.g. resize, flip). Using these features will use more CPU power.',

    category: SysPreferenceCategory.ImageProcessing,
  },
  [SysPreference.ConversionTimeLimit]: {
    name: 'Convert/Edit Time Limit',
    helpText:
      'Time limit for converting/editing images. You may need to increase this on low powered devices.',
    category: SysPreferenceCategory.ImageProcessing,
  },
  [SysPreference.ConversionMemoryLimit]: {
    name: 'Convert/Edit Memory Limit MB',
    helpText:
      'Memory limit for converting/editing images. You only need to increase this if you are storing massive images.',
    category: SysPreferenceCategory.ImageProcessing,
  },

  [SysPreference.JwtSecret]: {
    name: 'JWT Secret',
    helpText: 'Secret used to sign JWT authentication tokens.',
    category: SysPreferenceCategory.Authentication,
  },
  [SysPreference.JwtExpiresIn]: {
    name: 'JWT Expiry Time',
    helpText: 'Time before JWT authentication tokens expire.',
    category: SysPreferenceCategory.Authentication,
  },
  [SysPreference.BCryptStrength]: {
    name: 'BCrypt Strength',
    helpText:
      'Strength of BCrypt hashing algorithm, 10 is recommended. Reduce this if running on a low powered device.',
    category: SysPreferenceCategory.Authentication,
  },

  [SysPreference.FSLocalPath]: {
    name: 'FS Local - Path',
    helpText: 'Storage location of the local storage provider.',
    category: SysPreferenceCategory.FileStorage,
  },
  [SysPreference.FSS3Endpoint]: {
    name: 'FS S3 - Endpoint',
    helpText: 'Custom endpoint of the S3 storage provider.',
    category: SysPreferenceCategory.FileStorage,
  },
  [SysPreference.FSS3Bucket]: {
    name: 'FS S3 - Bucket',
    helpText: 'Bucket of the S3 storage provider.',
    category: SysPreferenceCategory.FileStorage,
  },
  [SysPreference.FSS3Region]: {
    name: 'FS S3 - Region',
    helpText: 'Region of the S3 storage provider.',
    category: SysPreferenceCategory.FileStorage,
  },
  [SysPreference.FSS3AccessKey]: {
    name: 'FS S3 - Access Key',
    helpText: 'Access key of the S3 storage provider.',
    category: SysPreferenceCategory.FileStorage,
  },
  [SysPreference.FSS3SecretKey]: {
    name: 'FS S3 - Secret Key',
    helpText: 'Secret key of the S3 storage provider.',
    category: SysPreferenceCategory.FileStorage,
  },

  [SysPreference.EnableTracking]: {
    name: 'Enable Ackee Web Tracking',
    helpText:
      'Enable tracking of the website usage using Ackee. You will need to set the tracking URL and ID.',
    category: SysPreferenceCategory.Usage,
  },
  [SysPreference.TrackingUrl]: {
    name: 'Ackee tracking URL',
    helpText:
      'URL of the Ackee tracking server. Requests are proxied, so ensure the X-Forwarded-For header is handled.',
    category: SysPreferenceCategory.Usage,
  },
  [SysPreference.TrackingId]: {
    name: 'Ackee trackign website ID',
    helpText: 'ID of the website to track.',
    category: SysPreferenceCategory.Usage,
  },

  [SysPreference.EnableTelemetry]: {
    name: 'Enable System Telemetry',
    helpText:
      'Enable system telemetry, this will send anonymous usage data to the developers.',
    category: SysPreferenceCategory.Usage,
  },
};
