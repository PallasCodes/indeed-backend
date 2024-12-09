import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { CreateUserDto } from '../auth/dto'
import { User } from '../auth/entities/user.entity'
import { JobSeeker } from './entitites/jobSeeker.entity'
import { CustomResponse } from '../utils/customResponse'
import { UserRoles } from '../auth/types/roles.type'
import { Employer } from './entitites/employer.entity'
import { UpdateOwnProfileJobSeekerDto } from './dto/update-own-profile-job-seeker.dto'

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,

    @InjectRepository(Employer)
    private readonly employerRepository: Repository<Employer>,

    private readonly dataSource: DataSource,
  ) {}

  async createUserWithProfile(dto: CreateUserDto) {
    const profile = await this.dataSource.transaction(
      async (manager: EntityManager) => {
        const { password, ...userData } = dto

        const user = manager.create(User, {
          ...userData,
          password: bcrypt.hashSync(password, 10),
        })
        await manager.save(user)

        let classRef

        if (user.role === UserRoles.JOB_SEEKER) {
          classRef = JobSeeker
        } else if (user.role === UserRoles.EMPLOYER) {
          classRef = Employer
        } else {
          throw new BadRequestException('Invalid role')
        }

        const profile = manager.create(classRef, {
          user,
        })
        return await manager.save(profile)
      },
    )

    return new CustomResponse({ profile })
  }

  async getOwnProfile(user: User) {
    if (!Object.values(UserRoles).includes(user.role)) {
      return new BadRequestException("User's role is not valid")
    }

    let repository: Repository<any>

    if (user.role === UserRoles.JOB_SEEKER) {
      repository = this.jobSeekerRepository
    } else if (user.role === UserRoles.EMPLOYER) {
      repository = this.employerRepository
    }

    console.log(user)

    const profile = await repository.findOneOrFail({
      relations: ['user'],
      where: { user: { id: user.id } },
    })

    return new CustomResponse({ profile })
  }

  async updateOwnProfileJobSeeker(
    user: User,
    dto: UpdateOwnProfileJobSeekerDto,
  ) {
    const jobSeeker = await this.jobSeekerRepository.findOneOrFail({
      where: { user: { id: user.id } },
      relations: ['user'],
    })

    if (!jobSeeker) {
      throw new Error('JobSeeker not found')
    }

    const { phoneNumber, ...userData } = dto
    const jobSeekerUpdateData = {
      phoneNumber: phoneNumber || jobSeeker.phoneNumber || null,
    }
    const userUpdateData = {
      ...userData,
      profileCompleted: true,
    }

    return this.dataSource.transaction(async (manager) => {
      manager.merge(JobSeeker, jobSeeker, jobSeekerUpdateData)

      const user = jobSeeker.user
      manager.merge(User, user, userUpdateData)

      await manager.save(User, user)
      await manager.save(JobSeeker, jobSeeker)

      return new CustomResponse({ jobSeeker })
    })
  }
}
