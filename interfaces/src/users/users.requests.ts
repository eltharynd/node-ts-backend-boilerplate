import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'
import 'reflect-metadata'

import { DisplayLanguages, DisplayThemes, Settings, User } from './users'

export class SettingsPatchRequest implements Partial<Settings> {
  @IsOptional()
  @IsEnum(DisplayThemes)
  selectedTheme: DisplayThemes

  @IsOptional()
  @IsEnum(DisplayLanguages)
  selectedlanguage: DisplayLanguages
}

export class UserPatchRequest implements Partial<User> {
  @IsOptional()
  @IsEmail()
  email: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsOptional()
  @IsNotEmpty()
  lastName: string

  @IsOptional()
  @IsBoolean()
  admin: boolean
}

export class UserPostRequest implements Partial<User> {
  @IsEmail()
  email: string

  @Length(8)
  password: string

  @IsNotEmpty()
  @IsOptional()
  firstName: string

  @IsNotEmpty()
  @IsOptional()
  lastName: string
}
