import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { JwtService } from './jwt.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from 'src/user/user.repository';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    private usersRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { username, firstName, lastName, email, password } = registerDto;

    const emailExists = await this.usersRepository.findUserByEmail(email);
    if (emailExists) {
      throw new BadRequestException('Email is already taken');
    }

    const usernameExists = await this.usersRepository.findUserByUsername(username);
    if (usernameExists) {
      throw new BadRequestException('Username is already taken');
    }
    
    // password hesh
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.usersRepository.createUser(
      username,
      firstName,
      lastName,
      email,
      hashedPassword
    )
  }

  async login(loginDto: LoginDto): Promise<JwtPayload & { token: string, expiredAt: string }> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findUserByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
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
