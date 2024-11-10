import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/auth/entities/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
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

  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @ApiProperty({
    example: 'Xatal - Web Solutions',
    uniqueItems: true,
    nullable: false,
  })
  @Column('varchar', { unique: true })
  companyName: string

  @ApiProperty({
    example: 'https://xatal.com',
    uniqueItems: true,
    nullable: false,
  })
  @Column('varchar', { unique: true })
  website: string
}
