import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { JobType } from '../types/JobType.type'
import { JobModality } from '../types/JobModality.type'

@Entity('jobs')
export class Job {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  // idEmployer

  @ApiProperty()
  @Column('varchar')
  title: string

  @ApiProperty()
  @Column('text')
  description: string

  @ApiProperty()
  @Column('float')
  salaryMin: number

  @ApiProperty()
  @Column('float')
  salaryMax: number

  @ApiProperty()
  @Column('enum', { enum: JobType })
  jobType: JobType

  @ApiProperty()
  @Column('varchar', { nullable: true })
  location?: string

  @ApiProperty()
  @Column('enum', { enum: JobModality })
  jobModality: JobModality

  @ApiProperty()
  @Column('boolean', { default: true })
  hiring: boolean

  @ApiProperty()
  @Column('date')
  appDeadline: Date

  // TODO: add created at and updated at fields
}
