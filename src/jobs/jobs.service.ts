import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Job } from './entities/job.entity'
import { Repository } from 'typeorm'
import { CustomResponse } from 'src/utils/CustomResponse'

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto) {
    const job = this.jobRepository.create(createJobDto)
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

    const [result, total] = await query
      .select([
        'job.id',
        'job.title',
        'job.salaryMin',
        'job.salaryMax',
        'job.jobType',
        'job.location',
        'job.jobModality',
        'job.description',
        'CAST(job.description AS varchar(100)), substring(job.description for 100)',
      ])
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return new CustomResponse({
      jobs: result,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    })
  }

  async findOne(id: string) {
    const job = await this.jobRepository.findOneByOrFail({ id })

    return new CustomResponse({ job })
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`
  }

  remove(id: number) {
    return `This action removes a #${id} job`
  }
}
