import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/auth/entities/user.entity'
import { Job } from 'src/jobs/entities/job.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('employers')
export class Employer {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty()
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @ApiProperty({
    example: 'Xatal - Web Solutions',
    uniqueItems: true,
    nullable: true,
  })
  @Column('varchar', { unique: true, nullable: true })
  companyName?: string

  @ApiProperty({
    example: 'https://xatal.com',
    uniqueItems: true,
    nullable: true,
  })
  @Column('varchar', { unique: true, nullable: true })
  website?: string

  @ApiProperty()
  @OneToMany(() => Job, (job) => job.employer, { onDelete: 'CASCADE' })
  jobs: Job[]
}
