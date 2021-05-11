import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompanyRepository } from './repositories/company.repository';
import { CompanyLocationRepository } from './repositories/companyLocation.repository';
import { CompanyPhoto } from './entities/companyPhoto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  anotherUserCredentialsDto,
  companyDataDto,
  fileDto,
  locationDto,
  mockedDb,
  mockedS3Service,
  userCredentialsDto,
} from '../../utils/mocks';
import { S3ManagerService } from '../../common/services/s3-manager.service';
import { UserRepository } from '../auth/repositories/user.repository';
import { User } from '../auth/user.entity';
import { CompaniesService } from './companies.service';
import { PassportModule } from '@nestjs/passport';
import { UserWithCompanyError } from './errors/userWithCompany.error';
import { Repository } from 'typeorm';
import { UserWithoutCompanyError } from './errors/userWithoutCompany.error';
import { LocationNotAssignedToCompanyError } from './errors/locationNotAssignedToCompany.error';

describe('CompaniesController', () => {
  let moduleRef: TestingModule;
  let companyController: CompaniesController;

  let userRepository: UserRepository;
  let companyRepository: CompanyRepository;
  let companyLocationRepository: CompanyLocationRepository;
  let companyPhotoRepository: Repository<CompanyPhoto>;

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
    companyRepository = moduleRef.get<CompanyRepository>(CompanyRepository);
    companyLocationRepository = moduleRef.get<CompanyLocationRepository>(
      CompanyLocationRepository,
    );

    companyPhotoRepository = moduleRef.get('CompanyPhotoRepository');

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

      expect(error).toStrictEqual(new UserWithCompanyError());
    });
  });

  describe('FindCompany', () => {
    it('should return array', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      const company = await companyRepository.save({
        ...companyDataDto,
        user_id: userData.id,
      });

      const companyLocation = await companyLocationRepository.save(
        locationDto(company.id),
      );

      company.locations = [companyLocation];

      await companyRepository.save(company);

      const result = await companyController.findAll({});

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

  describe('UpdateCompany', () => {
    it('should update company', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });
      let company = await companyController.create(companyDataDto, userData);

      const updatedCompany = { ...company, name: 'newName' };
      await companyController.update(updatedCompany, userData);

      company = await companyRepository.findById(updatedCompany.id);

      expect(company.name).toEqual(updatedCompany.name);
    });
  });

  describe('UploadPhoto', () => {
    it('should upload photo', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });
      await companyController.create(companyDataDto, userData);

      const upload = await companyController.createPhoto(fileDto, userData);

      expect(upload).toBeDefined();
    });

    it('should remove photo', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });
      await companyController.create(companyDataDto, userData);

      const upload = await companyController.createPhoto(fileDto, userData);

      expect(upload).toBeDefined();

      await companyController.deletePhoto({ id: upload.id }, userData);

      const companyPhoto = await companyPhotoRepository.findOne(upload.id);

      expect(companyPhoto).toBeUndefined();
    });
  });

  describe('CreateLocation', () => {
    it('should create location', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });
      const company = await companyController.create(companyDataDto, userData);

      const companyLocation = await companyController.createLocation(userData, {
        ...locationDto(company.id),
        user_id: userData.id,
      });

      expect(companyLocation).toBeDefined();
    });

    it('should not create location - ', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      let error;

      try {
        await companyController.createLocation(userData, {
          ...locationDto(1),
          user_id: userData.id,
        });
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new UserWithoutCompanyError());
    });

    it('should remove location', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });
      const company = await companyController.create(companyDataDto, userData);

      let companyLocation = await companyController.createLocation(userData, {
        ...locationDto(company.id),
        user_id: userData.id,
      });

      expect(companyLocation).toBeDefined();

      await companyController.deleteLocation(userData, {
        id: companyLocation.id,
      });

      companyLocation = await companyLocationRepository.findOne(
        companyLocation.id,
      );

      expect(companyLocation).toBeUndefined();
    });

    it('should return LocationNotAssignedToCompanyError', async () => {
      let error;

      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      const company = await companyController.create(companyDataDto, userData);

      const companyLocation = await companyController.createLocation(userData, {
        ...locationDto(company.id),
        user_id: userData.id,
      });

      const anotherUser: User = await userRepository.save(
        anotherUserCredentialsDto,
      );

      const anotherUserData: User = await userRepository.findOne({
        email: anotherUser.email,
      });

      await companyController.create(companyDataDto, anotherUserData);

      expect(companyLocation).toBeDefined();

      try {
        await companyController.deleteLocation(anotherUser, {
          id: companyLocation.id,
        });
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new LocationNotAssignedToCompanyError());
    });
  });

  describe('UploadLogo', () => {
    it('should upload logo', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });
      await companyController.create(companyDataDto, userData);

      const upload = await companyController.createPhoto(fileDto, userData);

      expect(upload).toBeDefined();
    });
  });
});
