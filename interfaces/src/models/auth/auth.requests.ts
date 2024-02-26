import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator'
import 'reflect-metadata'
import { User } from '../users/users'

export class AuthSignupRequest implements Partial<User> {
  @IsEmail()
  email: string

  @Length(10)
  password: string

  @IsNotEmpty()
  @IsOptional()
  firstName: string

  @IsNotEmpty()
  @IsOptional()
  lastName: string
}

export class AuthLoginRequest implements Partial<User> {
  @IsEmail()
  email: string

  @Length(9)
  password: string
}
