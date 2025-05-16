import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { JwtService } from './jwt.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from 'src/user/repository/user.repository';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EMAIL_TAKEN, INVALID_CREDENTIALS, USERNAME_TAKEN } from 'src/common/constants/response.contants';

@Injectable()
export class AuthService {

  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { username, firstName, lastName, email, password } = registerDto;

    const emailExists = await this.userRepository.findUserByEmail(email);
    if (emailExists) {
      throw new BadRequestException(EMAIL_TAKEN);
    }

    const usernameExists = await this.userRepository.findUserByUsername(username);
    if (usernameExists) {
      throw new BadRequestException(USERNAME_TAKEN);
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.createUser(
      username,
      firstName,
      lastName,
      email,
      hashedPassword
    )
  }

  async login(loginDto: LoginDto): Promise<JwtPayload & { token: string, expiredAt: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findUserByEmail(email)
    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const payload = {
      email: user.email,
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName 
    };

    const token = await this.jwtService.sign(payload);

    const expiredAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    
    return {
      ...payload,
      token,
      expiredAt
    };
  }

}
