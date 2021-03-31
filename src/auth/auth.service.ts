import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { JwtPayload } from "./jwt-payload.interface";
import { UserRepository } from "./user.repository";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) { }
  
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto):Promise<{accessToken: string}> {
    const email = await this.userRepository.validateUserPassword(authCredentialsDto);
    if (!email) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { email };
    const accessToken = await this.jwtService.sign(payload);
    return {accessToken}
  }
}