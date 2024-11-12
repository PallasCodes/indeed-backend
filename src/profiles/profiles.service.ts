import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { CreateUserDto } from 'src/auth/dto'
import { User } from 'src/auth/entities/user.entity'
import { JobSeeker } from './entitites/JobSeeker.entity'
import { CustomResponse, Message } from 'src/utils/CustomResponse'
import { UserRoles } from 'src/auth/types/roles.type'
import { Employer } from './entitites/employer.entity'

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

    const profile = await repository.findOneOrFail({
      relations: ['user'],
      where: { user: { id: user.id } },
    })

    return new CustomResponse({ profile })
  }
}
