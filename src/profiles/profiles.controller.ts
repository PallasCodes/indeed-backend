import { Body, Controller, Get, Post } from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { CreateUserDto } from 'src/auth/dto'
import { Auth, GetUser } from 'src/auth/decorators'
import { UserRoles } from 'src/auth/types/roles.type'
import { User } from 'src/auth/entities/user.entity'

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.profilesService.createUserWithProfile(dto)
  }

  @Auth()
  @Get('my-profile')
  getOwnProfile(@GetUser() user: User) {
    return this.profilesService.getOwnProfile(user)
  }
}
