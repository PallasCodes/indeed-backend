import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'

import { DataSource, EntityManager, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User } from './entities/user.entity'
import { CreateUserDto, LoginUserDto } from './dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { CheckEmailRegisteredDto } from './dto/check-email-registered.dto'
import { CustomResponse } from '../utils/customResponse'
import { UserRoles } from './types/roles.type'
import { JobSeeker } from 'src/profiles/entitites/jobSeeker.entity'
import { Employer } from 'src/profiles/entitites/employer.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,

    private readonly dataSource: DataSource,
  ) {}

  async register(dto: CreateUserDto) {
    const profile = await this.dataSource.transaction(
      async (manager: EntityManager) => {
        const { password, ...userData } = dto

        const user = manager.create(User, {
          ...userData,
          password: bcrypt.hashSync(password, 10),
        })
        await manager.save(user)

        let classRef

        if (user.role === UserRoles.JOB_SEEKER) {
          classRef = JobSeeker
        } else if (user.role === UserRoles.EMPLOYER) {
          classRef = Employer
        } else {
          throw new BadRequestException('Invalid role')
        }

        const profile = manager.create(classRef, {
          user,
        })
        return await manager.save(profile)
      },
    )

    return new CustomResponse({ profile })
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
        role: true,
        profileCompleted: true,
      },
    })

    if (!user) throw new UnauthorizedException('Credenciales no válidas')

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales no válidas')

    const token = this.getJwtToken({ id: user.id })

    return new CustomResponse({ user: { ...user, token } })
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail)

    console.log(error)
    throw new InternalServerErrorException('Check server logs')
  }

  async checkEmailRegistered(dto: CheckEmailRegisteredDto) {
    const emailIsRegistered = await this.userRepository.exist({
      where: { email: dto.email },
    })

    return new CustomResponse({ emailIsRegistered })
  }
}
