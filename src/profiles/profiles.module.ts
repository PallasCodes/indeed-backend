import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProfilesService } from './profiles.service'
import { ProfilesController } from './profiles.controller'
import { JobSeeker } from './entitites/JobSeeker.entity'
import { Employer } from './entitites/employer.entity'
import { AuthModule } from 'src/auth/auth.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [
    TypeOrmModule.forFeature([JobSeeker, Employer]),
    ConfigModule,
    AuthModule,
  ],
})
export class ProfilesModule {}
