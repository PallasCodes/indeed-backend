import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { JobsService } from './jobs.service'
import { JobsController } from './jobs.controller'
import { Job } from './entities/job.entity'
import { AuthModule } from 'src/auth/auth.module'
import { Employer } from 'src/profiles/entitites/employer.entity'

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [TypeOrmModule.forFeature([Job, Employer]), AuthModule],
})
export class JobsModule {}
