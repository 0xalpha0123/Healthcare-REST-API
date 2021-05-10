import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../auth/repositories/user.repository';
import { OffersRepository } from './offers.repository';
import { CompanyRepository } from '../companies/repositories/company.repository';
import { Repository } from 'typeorm';
import { Profession } from './entities/profession.entity';
import { Specialization } from './entities/specialization.entity';
import { AgreementType } from './entities/agreementType.entity';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  agreementTypeDto,
  companyDataDto,
  locationDto,
  mockedDb,
  offerDto,
  professionDto,
  specializationDto,
  userCredentialsDto,
} from '../../utils/mocks';
import { Candidate } from '../candidates/entities/candidate.entity';
import { CompanyPhoto } from '../companies/entities/companyPhoto.entity';
import { CompanyLocationRepository } from '../companies/repositories/companyLocation.repository';
import { CompaniesService } from '../companies/companies.service';
import { OffersController } from './offers.controller';
import { Company } from '../companies/entities/company.entity';
import { User } from '../auth/user.entity';
import { OffersService } from './offers.service';
import { CompanyLocation } from '../companies/entities/companyLocation.entity';

describe('OffersController', () => {
  let moduleRef: TestingModule;
  let offersController: OffersController;
  let userRepository: UserRepository;
  let offersRepository: OffersRepository;
  let companyRepository: CompanyRepository;
  let companyLocationRepository: CompanyLocationRepository;
  let professionRepository: Repository<Profession>;
  let specializationRepository: Repository<Specialization>;
  let agreementTypeRepository: Repository<AgreementType>;

  let company: Company;
  let profession: Profession;
  let specialization: Specialization;
  let agreementType: AgreementType;
  let companyLocation: CompanyLocation;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forRoot(mockedDb),
        TypeOrmModule.forFeature([
          UserRepository,
          OffersRepository,
          Candidate,
          CompanyPhoto,
          CompanyLocationRepository,
          CompanyRepository,
          Profession,
          Specialization,
          AgreementType,
        ]),
      ],
      controllers: [OffersController],
      providers: [OffersService, CompaniesService],
    }).compile();

    offersController = moduleRef.get<OffersController>(OffersController);
    offersRepository = moduleRef.get<OffersRepository>(OffersRepository);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    companyRepository = moduleRef.get<CompanyRepository>(CompanyRepository);
    companyLocationRepository = moduleRef.get<CompanyLocationRepository>(
      CompanyLocationRepository,
    );
    professionRepository = moduleRef.get('ProfessionRepository');
    specializationRepository = moduleRef.get('SpecializationRepository');
    agreementTypeRepository = moduleRef.get('AgreementTypeRepository');

    const user = await userRepository.save(userCredentialsDto);
    company = await companyRepository.save({
      ...companyDataDto,
      user_id: user.id,
    });

    profession = await professionRepository.save(professionDto);
    specialization = await specializationRepository.save(
      specializationDto(profession.id),
    );
    agreementType = await agreementTypeRepository.save(agreementTypeDto);
    companyLocation = await companyLocationRepository.save(
      locationDto(company.id),
    );
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('CreateOffer', () => {
    it('should create offer', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });
      const offer = await offersController.create(
        offerDto({
          companyId: company.id,
          agreementType,
          profession,
          specialization,
          companyLocation,
        }),
        userData,
      );
      expect(offer).toBeDefined();
    });
  });

  describe('UpdateOffer', () => {
    it('should update offer', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      const offerDtoSchema = offerDto({
        companyId: company.id,
        agreementType,
        profession,
        specialization,
        companyLocation,
      });

      const offer = await offersController.create(offerDtoSchema, userData);
      expect(offer).toBeDefined();

      const updatedOfferDtoSchema = {
        ...offerDtoSchema,
        salary_from: 10000,
        salary_to: 15000,
      };

      const result = await offersController.update(
        { id: offer.id },
        updatedOfferDtoSchema,
        userData,
      );

      expect(result).toBeDefined();
      expect(updatedOfferDtoSchema.salary_from).toEqual(result.salary_from);
      expect(updatedOfferDtoSchema.salary_to).toEqual(result.salary_to);
    });
  });

  describe('FindOffers', () => {
    it('should find all offers', async () => {
      const arrLength = 5;

      await Promise.all(
        Array(arrLength)
          .fill(0)
          .map(() =>
            offersRepository.save(
              offerDto({
                companyId: company.id,
                agreementType,
                profession,
                specialization,
                companyLocation,
              }),
            ),
          ),
      );

      const result = await offersController.findAll({});

      expect(result).toHaveLength(arrLength);
    });

    it('should find single offer', async () => {
      const offer = await offersRepository.save(
        offerDto({
          companyId: company.id,
          agreementType,
          profession,
          specialization,
          companyLocation,
        }),
      );

      const result = await offersController.findOne({ id: offer.id });

      expect(result).toBeDefined();
    });
  });

  describe('FindDictionaries', () => {
    it('should find professions', async () => {
      await professionRepository.save([
        { name: 'name1', icon_path: 'icon_path' },
        { name: 'name2', icon_path: 'icon_path' },
      ]);
      const result = await offersController.findAllProfessions();

      expect(result).toHaveLength(3);
    });

    it('should find specializations', async () => {
      await specializationRepository.save([
        specializationDto(profession.id),
        specializationDto(profession.id),
      ]);

      const result = await offersController.findAllSpecializations({});

      expect(result).toHaveLength(3);
    });

    it('should find agreement types', async () => {
      await agreementTypeRepository.save([
        { name: 'name1' },
        { name: 'name2' },
      ]);
      const result = await offersController.findAllAgreementTypes();

      expect(result).toHaveLength(3);
    });
  });
});
