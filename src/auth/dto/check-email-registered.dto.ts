import { IsEmail } from 'class-validator'

export class CheckEmailRegisteredDto {
  @IsEmail()
  email: string
}
