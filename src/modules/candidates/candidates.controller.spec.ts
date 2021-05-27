import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  agreementTypeDto,
  candidateDto,
  companyDataDto,
  cvDto,
  locationDto,
  mockedDb,
  mockedMailService,
  mockedS3Service,
  offerDto,
  professionDto,
  specializationDto,
  userCredentialsDto,
} from '../../utils/mocks';
import { S3ManagerService } from '../../common/services/s3-manager.service';
import { UserRepository } from '../auth/repositories/user.repository';
import { PassportModule } from '@nestjs/passport';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { Candidate } from './entities/candidate.entity';
import { OffersRepository } from '../offers/offers.repository';
import { MailService } from '../../common/services/mail.service';
import { CompanyRepository } from '../companies/repositories/company.repository';
import { CompanyPhoto } from '../companies/entities/companyPhoto.entity';
import { CompanyLocationRepository } from '../companies/repositories/companyLocation.repository';
import { CompaniesService } from '../companies/companies.service';
import { Repository } from 'typeorm';
import { Profession } from '../offers/entities/profession.entity';
import { Specialization } from '../offers/entities/specialization.entity';
import { AgreementType } from '../offers/entities/agreementType.entity';
import { Offer } from '../offers/entities/offer.entity';
import { User } from '../auth/user.entity';

describe('CandidatesController', () => {
  let moduleRef: TestingModule;
  let candidatesController: CandidatesController;
  let userRepository: UserRepository;
  let offersRepository: OffersRepository;
  let companyRepository: CompanyRepository;
  let companyLocationRepository: CompanyLocationRepository;
  let professionRepository: Repository<Profession>;
  let specializationRepository: Repository<Specialization>;
  let agreementTypeRepository: Repository<AgreementType>;

  let offer: Offer;

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
      controllers: [CandidatesController],
      providers: [
        CandidatesService,
        CompaniesService,
        {
          provide: MailService,
          useValue: mockedMailService,
        },
        {
          provide: S3ManagerService,
          useValue: mockedS3Service,
        },
      ],
    }).compile();

    candidatesController = moduleRef.get<CandidatesController>(
      CandidatesController,
    );
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
    const company = await companyRepository.save({
      ...companyDataDto,
      user_id: user.id,
    });

    const profession = await professionRepository.save(professionDto);
    const specialization = await specializationRepository.save(
      specializationDto(profession.id),
    );
    const agreementType = await agreementTypeRepository.save(agreementTypeDto);
    const companyLocation = await companyLocationRepository.save(
      locationDto(company.id),
    );

    offer = await offersRepository.save(
      offerDto({
        companyId: company.id,
        agreementType,
        profession,
        specialization,
        companyLocation: companyLocation,
      }),
    );
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('CreateCandidate', () => {
    it('should create candidate', async () => {
      const candidate = await candidatesController.create({
        ...candidateDto(offer.id),
      });
      expect(candidate).toBeDefined();
    });
  });

  describe('FindCandidate', () => {
    it('should find all candidates', async () => {
      await userRepository.save(userCredentialsDto);

      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      await Promise.all([
        candidatesController.create({ ...candidateDto(offer.id) }),
        candidatesController.create({ ...candidateDto(offer.id) }),
        candidatesController.create({ ...candidateDto(offer.id) }),
      ]);

      const candidates = await candidatesController.findAll(
        { offer_id: offer.id },
        userData,
      );

      expect(candidates).toBeDefined();
      expect(candidates).toHaveLength(3);
    });
  });

  describe('UploadCv', () => {
    it('should upload photo', async () => {
      const { file_path } = await candidatesController.createCV(cvDto);
      expect(file_path).toBeDefined();
    });
  });
});
