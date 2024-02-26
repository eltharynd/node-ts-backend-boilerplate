import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator'
import 'reflect-metadata'

import { DisplayLanguages, DisplayThemes, Settings, User } from './users'

export class SettingsPatchRequest implements Partial<Settings> {
  @IsEnum(DisplayThemes)
  @IsOptional()
  selectedTheme: DisplayThemes

  @IsEnum(DisplayLanguages)
  @IsOptional()
  selectedlanguage: DisplayLanguages
}

export class UserPatchRequest implements Partial<User> {
  @IsEmail()
  @IsOptional()
  email: string

  @IsNotEmpty()
  @IsOptional()
  @Length(3)
  firstName: string

  @IsNotEmpty()
  @IsOptional()
  lastName: string
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
