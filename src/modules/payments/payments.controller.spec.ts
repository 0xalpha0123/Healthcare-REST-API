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
  mockedTpayConfig,
  notifcationDto,
  offerDto,
  paymentDto,
  professionDto,
  specializationDto,
  transactionDto,
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
import md5 from 'md5';
import PaymentStatus from './paymentStatus.enum';
import { UnexpectedError } from '../../common/errors/unexpected.error';
import { CrcNotFoundError } from './errors/crcNotFound.error';
import { IncorrectMd5Error } from './errors/incorrectMd5.error';
import { IncorrectTrPaidError } from './errors/incorrectTrPaid.error';

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

  describe('CreateTransaction', () => {
    it('should create transaction', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      const result = await paymentsController.createTransaction(
        transactionDto({
          offer_id: offer.id,
          amount: 1000,
          bank_id: 10,
          extension_days: 5,
        }),
        userData,
      );

      expect(result).toBeDefined();
    });
  });

  describe('HandleNotification', () => {
    it('should handle notification', async () => {
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      const paidAmount = 1000;

      await paymentsController.createTransaction(
        transactionDto({
          offer_id: offer.id,
          amount: paidAmount,
          extension_days: 5,
          bank_id: 10,
        }),
        userData,
      );

      let payment: Payment = await paymentRepository.findOne({
        offer_id: offer.id,
      });

      const md5sum = md5(
        String(mockedTpayConfig.id) +
          String(payment.amount) +
          payment.crc +
          mockedTpayConfig.security_code,
      );

      const notification = notifcationDto({
        id: mockedTpayConfig.id,
        tr_status: 'TRUE',
        tr_error: 'none',
        tr_crc: payment.crc,
        md5sum,
        tr_paid: paidAmount,
      });

      await paymentsController.handleNotification(notification);

      payment = await paymentRepository.findOne({
        offer_id: offer.id,
      });

      expect(payment.status).toEqual(PaymentStatus.SUCCESS);
    });

    it('should return UnexpectedError', async () => {
      let error;

      const notification = notifcationDto({
        id: mockedTpayConfig.id,
        tr_status: 'FALSE',
        tr_error: 'ERROR',
        tr_crc: 'crc',
        md5sum: 'md5sum',
        tr_paid: 1000,
      });

      try {
        await paymentsController.handleNotification(notification);
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new UnexpectedError());
    });

    it('should return CrcNotFoundError', async () => {
      let error;

      const notification = notifcationDto({
        id: mockedTpayConfig.id,
        tr_status: 'TRUE',
        tr_error: 'none',
        tr_crc: 'crc',
        md5sum: 'md5sum',
        tr_paid: 1000,
      });

      try {
        await paymentsController.handleNotification(notification);
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new CrcNotFoundError());
    });

    it('should return IncorrectMd5Error', async () => {
      let error;
      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      const paidAmount = 1000;

      await paymentsController.createTransaction(
        transactionDto({
          offer_id: offer.id,
          amount: paidAmount,
          extension_days: 5,
          bank_id: 10,
        }),
        userData,
      );

      let payment: Payment = await paymentRepository.findOne({
        offer_id: offer.id,
      });

      const notification = notifcationDto({
        id: mockedTpayConfig.id,
        tr_status: 'TRUE',
        tr_error: 'none',
        tr_crc: payment.crc,
        md5sum: 'badmd5sum',
        tr_paid: paidAmount,
      });

      try {
        await paymentsController.handleNotification(notification);
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new IncorrectMd5Error());

      payment = await paymentRepository.findOne({
        offer_id: offer.id,
      });

      expect(payment.status).toEqual(PaymentStatus.CANCELED);
    });

    it('should return IncorrectTrPaidError', async () => {
      let error;

      const userData: User = await userRepository.findOne({
        email: userCredentialsDto.email,
      });

      const paidAmount = 1000;

      await paymentsController.createTransaction(
        transactionDto({
          offer_id: offer.id,
          amount: paidAmount,
          extension_days: 5,
          bank_id: 10,
        }),
        userData,
      );

      let payment: Payment = await paymentRepository.findOne({
        offer_id: offer.id,
      });

      const md5sum = md5(
        String(mockedTpayConfig.id) +
          String(payment.amount) +
          payment.crc +
          mockedTpayConfig.security_code,
      );

      const notification = notifcationDto({
        id: mockedTpayConfig.id,
        tr_status: 'TRUE',
        tr_error: 'none',
        tr_crc: payment.crc,
        md5sum,
        tr_paid: 5000,
      });

      try {
        await paymentsController.handleNotification(notification);
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new IncorrectTrPaidError());

      payment = await paymentRepository.findOne({
        offer_id: offer.id,
      });

      expect(payment.status).toEqual(PaymentStatus.CANCELED);
    });
  });
});
