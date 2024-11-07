import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/auth/entities/user.entity'
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

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
  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  userId: string

  @ApiProperty({
    example: '+522281237048',
    uniqueItems: true,
    nullable: false,
  })
  @Column('varchar', { unique: true })
  phoneNumber: string

  @ApiProperty({
    example: 'https://s3.com',
    uniqueItems: true,
    nullable: true,
  })
  @Column('varchar', { nullable: true })
  resumeURL?: string
}
