import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import 'reflect-metadata'
import { User } from '../users/users'

export class AuthSignupRequest implements Partial<User> {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName: string
}

export class AuthLoginRequest implements Partial<User> {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
