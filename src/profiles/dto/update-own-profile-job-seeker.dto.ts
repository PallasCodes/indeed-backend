import { IsOptional, IsString, Length } from 'class-validator'

export class UpdateOwnProfileJobSeekerDto {
  @IsOptional()
  @IsString()
  @Length(10, 16)
  phoneNumber?: string | null = null

  @IsOptional()
  @IsString()
  @Length(1, 40)
  name?: string | null

  @IsOptional()
  @IsString()
  @Length(1, 50)
  lastName?: string | null

  @IsOptional()
  @IsString()
  @Length(2, 50)
  location?: string | null
}
