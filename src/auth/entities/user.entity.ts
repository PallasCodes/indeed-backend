import { ApiProperty } from '@nestjs/swagger'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { UserRoles } from '../types/roles.type'

@Entity('users')
export class User {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty()
  @Column('varchar', { nullable: true })
  name?: string

  @ApiProperty()
  @Column('varchar', { nullable: true })
  lastName?: string

  @ApiProperty()
  @Column('varchar', { unique: true })
  email: string

  @ApiProperty()
  @Column('varchar', { select: false })
  password: string

  @ApiProperty()
  @Column('varchar')
  role: UserRoles

  @ApiProperty()
  @Column('varchar', { nullable: true })
  location?: string

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLocaleLowerCase().trim()
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert()
  }
}
