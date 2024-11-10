import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
} from '@nestjs/common'
import { JobsService } from './jobs.service'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { TrimQueryPipe } from 'src/trim-query/trim-query.pipe'

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto)
  }

  @Get()
  @UsePipes(TrimQueryPipe)
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('location') location: string,
    @Query('title') title: string,
  ) {
    return this.jobsService.findAll(page, limit, { location, title })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id)
  }
}
