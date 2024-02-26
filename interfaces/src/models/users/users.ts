export enum DisplayThemes {
  'light' = 'light',
  'dark' = 'dark',
}

export enum DisplayLanguages {
  'en' = 'en',
  'de' = 'de',
  'it' = 'it',
  'fr' = 'fr',
}

export interface Settings {
  selectedTheme: DisplayThemes
  selectedLanguage: DisplayLanguages
}

export interface User {
  email: string
  password: string

  firstName: string
  lastName: string

  admin?: boolean

  settings?: Settings
}
export interface PublicUser extends Omit<User, keyof { _id; password }> {}
