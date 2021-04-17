import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async verifyEmail(verificationToken: string): Promise<void> {
    const user = await this.userRepository.verifyEmail(verificationToken);
    if (!user) {
      throw new UnauthorizedException('Incorrect verificationToken');
    }
  }

  async changePassword(
    authCredentialsDto: AuthCredentialsDto,
    user: User,
  ): Promise<void> {
    return this.userRepository.changePassword(authCredentialsDto, user);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.validateUser(authCredentialsDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.active) {
      throw new UnauthorizedException('Inactive account');
    }
    const payload: JwtPayload = { id: user.id, email: user.email };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
