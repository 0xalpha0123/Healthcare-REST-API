import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth-credentials.dto';
import { User } from '../user.entity';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserEmailExistsError } from '../errors/userEmailExists.error';
import { InvalidCredentialsError } from '../errors/invalidCredentials.error';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { email, password } = authCredentialsDto;

    const user = new User();
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.verification_token = crypto.randomBytes(128).toString('hex');
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new UserEmailExistsError();
      } else {
        throw new InternalServerErrorException(error);
      }
    }
    return user;
  }

  async changePassword(authCredentialsDto: AuthCredentialsDto, userData: User) {
    const { email, password } = authCredentialsDto;
    const user = await this.findOne({ id: userData.id, email });
    if (!user) {
      throw new InvalidCredentialsError();
    }
    user.password = await this.hashPassword(password, user.salt);
    await user.save();
  }

  async verifyEmail(verificationToken: string): Promise<User> {
    const user = await this.findOne({ verification_token: verificationToken });
    if (!user) {
      return null;
    }
    user.active = true;
    await user.save();
    return user;
  }

  async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { email, password } = authCredentialsDto;
    const user = await this.findOne({ email });
    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
