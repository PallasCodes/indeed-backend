import { Injectable } from '@nestjs/common'
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
      return 'there was an error'
    }
  }

  async findAll() {
    const jobs = await this.jobRepository.find()
    return jobs
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
