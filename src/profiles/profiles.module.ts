import { Module } from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { ProfilesController } from './profiles.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobSeeker } from './entitites/JobSeeker.entity'
import { Employer } from './entitites/employer.entity'

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [TypeOrmModule.forFeature([JobSeeker, Employer])],
})
export class ProfilesModule {}
