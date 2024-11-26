import { IsString, IsOptional, IsEnum, IsNumber, IsDate } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { JobType } from 'src/jobs/types/JobType.type'
import { JobModality } from 'src/jobs/types/JobModality.type'

export class CreateJobDto {
  @ApiProperty({
    example: 'Software Engineer',
    description: 'Job title',
  })
  @IsString()
  title: string

  @ApiProperty({
    example: 'We are looking for a passionate software engineer...',
    description: 'Job description',
  })
  @IsString()
  description: string

  @ApiProperty({
    example: 50000,
    description: 'Minimum salary for the job',
  })
  @IsNumber()
  salaryMin: number

  @ApiProperty({
    example: 80000,
    description: 'Maximum salary for the job',
  })
  @IsNumber()
  salaryMax: number

  @ApiProperty({
    example: 'FULL_TIME',
    description: 'Type of job (e.g., FULL_TIME, PART_TIME, etc.)',
  })
  @IsEnum(JobType)
  jobType: JobType

  @ApiProperty({
    example: 'Remote',
    description: 'Location of the job',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string

  @ApiProperty({
    example: 'REMOTE',
    description: 'Modality of the job (e.g., REMOTE, ON_SITE, etc.)',
  })
  @IsEnum(JobModality)
  jobModality: JobModality

  @ApiProperty({
    example: '2024-12-31',
    description: 'Application deadline for the job',
  })
  @IsDate()
  @Type(() => Date)
  appDeadline: Date
}
