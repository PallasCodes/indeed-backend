import { Body, Controller, Get, Post, Put } from '@nestjs/common'

import { ProfilesService } from './profiles.service'
import { CreateUserDto } from 'src/auth/dto'
import { Auth, GetUser } from 'src/auth/decorators'
import { User } from 'src/auth/entities/user.entity'
import { UpdateOwnProfileJobSeekerDto } from './dto/update-own-profile-job-seeker.dto'

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

  @Auth()
  @Put('my-profile/job-seeker')
  updateOwnProfile(
    @GetUser() user: User,
    @Body() dto: UpdateOwnProfileJobSeekerDto,
  ) {
    return this.profilesService.updateOwnProfileJobSeeker(user, dto)
  }
}
