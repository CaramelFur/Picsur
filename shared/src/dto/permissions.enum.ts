// Only add no rename
// This enum only makes permissions easier to program,
// This does not have to be a complete list of all permissions
// -> the frontend and backend can be somewhat out of sync
export enum Permission {
  ImageView = 'image-view',
  ImageUpload = 'image-upload', // Ability to upload and manage own images

  UserLogin = 'user-login', // Ability to log in
  UserKeepLogin = 'user-keep-login', // Ability to view own user details and refresh token
  UserRegister = 'user-register', // Ability to register

  Settings = 'settings', // Ability to view (personal) settings

  ApiKey = 'apikey', // Ability to create and remove your own api keys

  ImageAdmin = 'image-admin', // Ability to manage everyones manage images
  UserAdmin = 'user-admin', // Allow modification of users
  RoleAdmin = 'role-admin', // Allow modification of roles
  ApiKeyAdmin = 'apikey-admin', // Allow modification of all api keys
  SysPrefAdmin = 'syspref-admin',
}
