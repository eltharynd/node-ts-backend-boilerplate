import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator'
import mongoose from 'mongoose'
import 'reflect-metadata'
import { DisplayLanguages, DisplayThemes, PublicUser, Settings } from './users'

export class SettingsResponse implements Settings {
  @IsEnum(DisplayThemes)
  selectedTheme: DisplayThemes
  @IsEnum(DisplayLanguages)
  selectedLanguage: DisplayLanguages
}

export class PublicUserResponse implements PublicUser {
  @IsEmail()
  email: string

  @IsString()
  firstName: string
  @IsString()
  lastName: string

  @IsOptional()
  @IsBoolean()
  admin?: boolean

  @ValidateNested()
  settings: SettingsResponse
}

export class UserWithIdResponse extends PublicUserResponse {
  @IsString()
  @Matches(/^[0-9a-f]{24}$/i)
  _id?: mongoose.Types.ObjectId | string
}
