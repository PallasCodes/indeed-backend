import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'

import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User } from './entities/user.entity'
import { CreateUserDto, LoginUserDto } from './dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { CheckEmailRegisteredDto } from './dto/check-email-registered.dto'
import { CustomResponse } from '../utils/CustomResponse'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      })
      await this.userRepository.save(user)

      delete user.password
      const token = this.getJwtToken({ id: user.id })

      return new CustomResponse({ user: { ...user, token } })
    } catch (error) {
      this.handleDBErrors(error)
    }
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
