import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../../common/services/mail.service';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  mockedConfigService,
  mockedDb,
  mockedMailService,
  userCredentialsDto,
} from '../../utils/mocks';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserEmailExistsError } from './errors/userEmailExists.error';
import { IncorrectTokenError } from './errors/incorrectToken.error';
import { InvalidCredentialsError } from './errors/invalidCredentials.error';
import { InactiveAccountError } from './errors/inactiveAccount.error';

describe('AuthController', () => {
  let moduleRef: TestingModule;
  let authController: AuthController;
  let userRepository: UserRepository;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forRoot(mockedDb),
        TypeOrmModule.forFeature([UserRepository]),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: MailService,
          useValue: mockedMailService,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: { sign: () => '' },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('SignUp', () => {
    it('should sign up', async () => {
      await authController.signUp(userCredentialsDto);
    });

    it('should not sign up - email taken', async () => {
      let error;

      await authController.signUp(userCredentialsDto);

      try {
        await authController.signUp(userCredentialsDto);
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new UserEmailExistsError());
    });
  });

  describe('ValidateToken', () => {
    it('should verify account', async () => {
      await authController.signUp(userCredentialsDto);

      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      expect(userData).toBeDefined();

      await authController.verifyEmail({
        verificationToken: userData.verification_token,
      });
    });

    it('should not verify account - wrong token', async () => {
      let error;
      try {
        await authController.verifyEmail({
          verificationToken: 'wrongtoken',
        });
      } catch (e) {
        error = e;
      }
      expect(error).toStrictEqual(new IncorrectTokenError());
    });
  });

  describe('SignIn', () => {
    it('should log in', async () => {
      await authController.signUp(userCredentialsDto);

      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      expect(userData).toBeDefined();

      await authController.verifyEmail({
        verificationToken: userData.verification_token,
      });

      await authController.signIn(userCredentialsDto);
    });

    it('should not log in - invalid credentials', async () => {
      let error;
      try {
        await authController.signIn({ email: 'notExists', password: 'atAll' });
      } catch (e) {
        error = e;
      }
      expect(error).toStrictEqual(new InvalidCredentialsError());
    });

    it('should not log in - account not activated', async () => {
      let error;

      await authController.signUp(userCredentialsDto);

      try {
        await authController.signIn(userCredentialsDto);
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new InactiveAccountError());
    });
  });

  describe('ChangePassword', () => {
    it('should change password and log in', async () => {
      await authController.signUp(userCredentialsDto);

      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      await authController.verifyEmail({
        verificationToken: userData.verification_token,
      });

      const newPassword = 'newPasswordTest777';

      await authController.changePassword(
        { ...userCredentialsDto, password: newPassword },
        userData,
      );

      await authController.signIn({
        ...userCredentialsDto,
        password: newPassword,
      });
    });
  });
});
