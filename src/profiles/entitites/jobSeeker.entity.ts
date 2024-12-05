import { ApiProperty } from '@nestjs/swagger'
import { User } from '../../auth/entities/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('jobSeekers')
export class JobSeeker {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @ApiProperty({
    example: '+522281237048',
    uniqueItems: true,
    nullable: true,
  })
  @Column('varchar', { unique: true, nullable: true })
  phoneNumber?: string

  @ApiProperty({
    example: 'https://s3.com',
    uniqueItems: true,
    nullable: true,
  })
  @Column('varchar', { nullable: true })
  resumeURL?: string
}
