import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { Job } from './entities/job.entity'
import { CustomResponse } from '../utils/customResponse'
import { User } from '../auth/entities/user.entity'
import { Employer } from '../profiles/entitites/employer.entity'

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @InjectRepository(Employer)
    private readonly employerRepository: Repository<Employer>,
  ) {}

  async create(createJobDto: CreateJobDto, user: User) {
    const employer = await this.employerRepository.findOneBy({
      user: { id: user.id },
    })
    if (!employer) {
      throw new BadRequestException('Employer not found')
    }
    if (!user.profileCompleted) {
      throw new BadRequestException('Finish your profile first')
    }

    const job = this.jobRepository.create(createJobDto)
    job.employer = employer
    await this.jobRepository.save(job)

    return new CustomResponse(job)
  }

  async findAll(page: number = 1, limit: number = 10, filters?: any) {
    const query = await this.jobRepository.createQueryBuilder('job')

    if (filters?.location && filters.location !== '') {
      query.andWhere('job.location iLIKE :location', {
        location: `%${filters.location}%`,
      })
    }

    if (filters?.title && filters.title !== '') {
      query.andWhere('job.title iLIKE :title', {
        title: `%${filters.title}%`,
      })
    }

    const result = await query
      .select([
        'job.id AS id',
        'job.title AS title',
        'job.salaryMin AS salaryMin',
        'job.salaryMax AS salaryMax',
        'job.jobType AS jobType',
        'job.location AS location',
        'job.jobModality AS jobModality',
      ])
      .addSelect('SUBSTRING(job.description, 1, 150)', 'description')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany()

    return new CustomResponse({
      jobs: result,
      total: result.length,
      page,
      lastPage: Math.ceil(result.length / limit),
    })
  }

  async findOne(id: string) {
    const job = await this.jobRepository.findOneOrFail({
      where: { id },
      relations: ['employer'],
    })

    return new CustomResponse({ job })
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`
  }

  remove(id: number) {
    return `This action removes a #${id} job`
  }
}
