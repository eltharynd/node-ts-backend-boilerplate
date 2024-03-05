import mongoose from 'mongoose'

export enum DisplayThemes {
  'system' = 'system',
  'dark' = 'dark',
  'light' = 'light',
}

export enum DisplayLanguages {
  'en' = 'en',
  'it' = 'it',
}

export class Settings {
  selectedTheme: DisplayThemes
  selectedLanguage: DisplayLanguages
}

export class PublicUser {
  email: string

  firstName: string
  lastName: string

  admin?: boolean

  settings?: Settings
}

export class User extends PublicUser {
  _id?: mongoose.Types.ObjectId | string

  password: string
}
