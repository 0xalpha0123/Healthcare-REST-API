import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import MailService from 'src/common/services/mail.service';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import getEmailTemplate from './email.template';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const user = await this.userRepository.signUp(authCredentialsDto);
    await this.mailService.sendMail({
      from: 'Healthcare Hireos <hello@healthcare-hireos.com>',
      to: user.email,
      subject: 'Healthcare Hireos - confirm your account',
      html: getEmailTemplate(user.verification_token)
    })
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
