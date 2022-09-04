/*
{
  "Version": "14.1.0",
  "Name": "Picsur",
  "DestinationType": "ImageUploader",
  "RequestMethod": "POST",
  "RequestURL": "https://d290-87-208-4-195.eu.ngrok.io/api/image/upload",
  "Headers": {
    "Authorization": "Api-Key Hello"
  },
  "Body": "MultipartFormData",
  "FileFormName": "image",
  "URL": "https://d290-87-208-4-195.eu.ngrok.io/view/{json:data.id}",
  "ThumbnailURL": "https://d290-87-208-4-195.eu.ngrok.io/i/{json:data.id}.png?width=256&shrinkonly=yes",
  "DeletionURL": "https://d290-87-208-4-195.eu.ngrok.io/api/image/delete/{json:data.id}/{json:data.delete_key}",
  "ErrorMessage": "{json:data.message}"
}

*/

export interface ShareXObject {
  Version: string;
  Name: string;
  DestinationType: string;
  RequestMethod: string;
  RequestURL: string;
  Headers: {
    Authorization: string;
  };
  Body: string;
  FileFormName: string;
  URL: string;
  ThumbnailURL: string;
  DeletionURL?: string;
  ErrorMessage: string;
}

export function BuildShareX(
  host: string,
  apikey: string,
  preferredExt: string,
  canDelete: boolean,
): ShareXObject {
  const base: ShareXObject = {
    Version: '14.1.0',
    Name: 'Picsur',
    DestinationType: 'ImageUploader',
    RequestMethod: 'POST',
    RequestURL: `${host}/api/image/upload`,
    Headers: {
      Authorization: `Api-Key ${apikey}`,
    },
    Body: 'MultipartFormData',
    FileFormName: 'image',
    URL: `${host}/i/{json:data.id}${preferredExt}`,
    ThumbnailURL: `${host}/i/{json:data.id}.jpg?width=128&shrinkonly=yes`,
    ErrorMessage: '{json:data.message}',
  };

  if (canDelete) {
    base.DeletionURL = `${host}/api/image/delete/{json:data.id}/{json:data.delete_key}`;
  }

  return base;
}
