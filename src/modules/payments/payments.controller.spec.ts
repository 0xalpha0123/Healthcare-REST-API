import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../auth/repositories/user.repository';
import { OffersRepository } from '../offers/offers.repository';
import { CompanyRepository } from '../companies/repositories/company.repository';
import { CompanyLocationRepository } from '../companies/repositories/companyLocation.repository';
import { Repository } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  agreementTypeDto,
  companyDataDto,
  locationDto,
  mockedConfigService,
  mockedDb,
  mockedHttpServiceForPayments,
  offerDto,
  paymentDto,
  professionDto,
  specializationDto,
  userCredentialsDto,
} from '../../utils/mocks';
import { PaymentsController } from './payments.controller';
import { Payment } from './payment.entity';
import { HttpService } from '@nestjs/common';
import { Profession } from '../offers/entities/profession.entity';
import { Specialization } from '../offers/entities/specialization.entity';
import { AgreementType } from '../offers/entities/agreementType.entity';
import { Candidate } from '../candidates/entities/candidate.entity';
import { CompanyPhoto } from '../companies/entities/companyPhoto.entity';
import { User } from '../auth/user.entity';
import { PaymentsService } from './payments.service';
import { ConfigService } from '@nestjs/config';
import { CompaniesService } from '../companies/companies.service';

describe('PaymentsController', () => {
  let moduleRef: TestingModule;
  let paymentsController: PaymentsController;
  let userRepository: UserRepository;
  let paymentRepository: Repository<Payment>;
  let offersRepository: OffersRepository;
  let companyRepository: CompanyRepository;
  let companyLocationRepository: CompanyLocationRepository;
  let professionRepository: Repository<Profession>;
  let specializationRepository: Repository<Specialization>;
  let agreementTypeRepository: Repository<AgreementType>;

  let offer;

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
          Payment,
        ]),
      ],
      controllers: [PaymentsController],
      providers: [
        PaymentsService,
        CompaniesService,
        {
          provide: HttpService,
          useValue: mockedHttpServiceForPayments,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();

    paymentsController = moduleRef.get<PaymentsController>(PaymentsController);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    paymentRepository = moduleRef.get('PaymentRepository');
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

  describe('FindPayments', () => {
    it('should find all payments', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      await paymentRepository.save([
        paymentDto(offer.id),
        paymentDto(offer.id),
        paymentDto(offer.id),
      ]);

      const result = await paymentsController.findAll(userData);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
    });
  });
});
