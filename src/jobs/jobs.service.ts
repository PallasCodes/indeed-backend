import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Job } from './entities/job.entity'
import { Repository } from 'typeorm'

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto) {
    try {
      const job = this.jobRepository.create(createJobDto)
      await this.jobRepository.save(job)
      return job
    } catch (err) {
      console.log(err)
      return new Error('there was en error')
    }
  }

  async findAll(page: number = 1, limit: number = 10, filters?: any) {
    console.log(filters)
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
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return { jobs: result, total, page, lastPage: Math.ceil(total / limit) }
  }

  findOne(id: number) {
    return `This action returns a #${id} job`
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`
  }

  remove(id: number) {
    return `This action removes a #${id} job`
  }
}
