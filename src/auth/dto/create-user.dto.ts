import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'
import { UserRoles } from '../types/roles.type'

export class CreateUserDto {
  @ApiProperty({
    nullable: false,
    minLength: 4,
    maxLength: 20,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string

  @ApiProperty()
  @IsString()
  lastName: string

  @ApiProperty()
  @IsEnum(UserRoles)
  @IsString()
  role: UserRoles
  // ver la forma de omitir admin

  @ApiProperty()
  @IsString()
  @IsOptional()
  location?: string

  @ApiProperty({
    nullable: false,
  })
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({
    description:
      'Passwords must have a lowercase and uppercase letter, a number and must have 8 words minimum and 32 maximum',
    nullable: false,
    minLength: 8,
    maxLength: 32,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must have a lowercase and uppercase letter, a number and must have 8 words minimum and 32 maximum',
  })
  password: string
}