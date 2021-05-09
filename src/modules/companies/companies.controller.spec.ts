import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompanyRepository } from './repositories/company.repository';
import { CompanyLocationRepository } from './repositories/companyLocation.repository';
import { CompanyPhoto } from './entities/companyPhoto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  companyDataDto,
  mockedDb,
  mockedS3Service,
  userCredentialsDto,
} from '../../utils/mocks';
import { S3ManagerService } from '../../common/services/s3-manager.service';
import { UserRepository } from '../auth/repositories/user.repository';
import { User } from '../auth/user.entity';
import { CompaniesService } from './companies.service';
import { PassportModule } from '@nestjs/passport';
import { UserHaveCompanyError } from './errors/userHaveCompany.error';

describe('CompaniesController', () => {
  let moduleRef: TestingModule;
  let companyController: CompaniesController;

  let userRepository: UserRepository;
  // let companyRepository: CompanyRepository;
  // let companyLocationRepository: CompanyLocationRepository;
  // let companyPhotoRepository: Repository<CompanyPhoto>;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forRoot(mockedDb),
        TypeOrmModule.forFeature([
          CompanyRepository,
          CompanyLocationRepository,
          CompanyPhoto,
          UserRepository,
        ]),
      ],
      controllers: [CompaniesController],
      providers: [
        CompaniesService,
        {
          provide: S3ManagerService,
          useValue: mockedS3Service,
        },
      ],
    }).compile();

    companyController = moduleRef.get<CompaniesController>(CompaniesController);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    // companyRepository = moduleRef.get<CompanyRepository>(CompanyRepository);
    // companyLocationRepository = moduleRef.get<CompanyLocationRepository>(
    //   CompanyLocationRepository,
    // );
    // companyPhotoRepository = moduleRef.get<Repository<CompanyPhoto>>
    await userRepository.save(userCredentialsDto);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('CreateCompany', () => {
    it('should create company', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      await companyController.create(companyDataDto, userData);
    });

    it('should not create company - user already have company', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      let error;

      await companyController.create(companyDataDto, userData);

      try {
        await companyController.create(companyDataDto, userData);
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new UserHaveCompanyError());
    });
  });

  describe('Find', () => {
    it('should return array', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });
      const company = await companyController.create(
        companyDataDto,
        userData,
      );
      const result = await companyController.findAll();

      expect(result).toHaveLength(1);
      expect(company).toMatchObject(result[0]);
    });

    it('should return single company by id', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });
      const company = await companyController.create(companyDataDto, userData);

      const result = await companyController.findOne({
        id: company.id,
      });

      expect(company).toMatchObject(result);
    });

    it('should return single company by user', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });
      const company = await companyController.create(companyDataDto, userData);
      const result = await companyController.findUserCompany(userData);

      expect(company).toMatchObject(result);
    });
  });
});
