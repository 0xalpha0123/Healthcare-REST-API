import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../../common/services/mail.service';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService, mockedDb } from '../../utils/mocks';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserEmailExistsError } from './errors/userEmailExists.error';
import { IncorrectTokenError } from './errors/incorrectToken.error';
import { InvalidCredentialsError } from './errors/invalidCredentials.error';
import { InactiveAccountError } from './errors/inactiveAccount.error';

describe('AuthController', () => {
  let authController: AuthController;
  let mailService: MailService;
  let moduleRef: TestingModule;
  let userRepository: UserRepository;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forRoot(mockedDb([User])),
        TypeOrmModule.forFeature([UserRepository]),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        MailService,
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
    mailService = moduleRef.get<MailService>(MailService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  const userCredentialsDto = {
    email: 'email@gmail.com',
    password: 'testingPassword123!',
  };

  describe('signUp', () => {
    it('should sign up', async () => {
      jest.spyOn(mailService, 'sendMail').mockImplementation(() => true);

      await authController.signUp(userCredentialsDto);
    });

    it('should not sign up - email taken', async () => {
      let error;

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
      jest.spyOn(mailService, 'sendMail').mockImplementation(() => true);

      const newUserCredentials = {
        email: `${userCredentialsDto}1`,
        password: userCredentialsDto.password,
      };

      await authController.signUp(newUserCredentials);

      try {
        await authController.signIn(newUserCredentials);
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new InactiveAccountError());
    });
  });

  describe('ChangePassword', () => {
    it('should change password', async () => {
      // todo change password tests and auth
      // await authController.changePassword({
      //   email: userCredentialsDto.email,
      // });
    });
  });
});
