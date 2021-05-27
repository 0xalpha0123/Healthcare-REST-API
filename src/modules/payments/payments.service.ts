import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TpayConfig } from 'src/config/configuration';
import { Bank, BankResponse } from './bank.interface';
import md5 from 'md5';
import crypto from 'crypto';
import TransactionDto from './transaction.dto';
import t from '../../locale/pl.json';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';
import PaymentStatus from './paymentStatus.enum';
import NotificationDto from './notification.dto';
import { Offer } from '../offers/entities/offer.entity';
import { User } from '../auth/user.entity';
import { CompaniesService } from '../companies/companies.service';
import { UnexpectedError } from '../../common/errors/unexpected.error';
import { CrcNotFoundError } from './errors/crcNotFound.error';
import { IncorrectMd5Error } from './errors/incorrectMd5.error';
import { IncorrectTrPaidError } from './errors/incorrectTrPaid.error';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private httpService: HttpService,
    private companiesService: CompaniesService,
  ) {
    this.config = this.configService.get('tpay');
  }
  config: TpayConfig;

  async getPaymentsByUserId(userId: number) {
    const whereoffer_idIn = (qb) => {
      const subQuery = qb
        .subQuery()
        .select('off.id')
        .from(Offer, 'off')
        .innerJoin('off.company', 'company')
        .where('company.user_id = :userId', { userId })
        .getQuery();
      return `p.offer_id IN ${subQuery}`;
    };
    return await this.paymentRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.offer', 'o')
      .select([
        'p.title',
        'p.extension_days',
        'p.amount',
        'p.status',
        'p.created_at',
        'o.title',
      ])
      .where(whereoffer_idIn)
      .getMany();
  }

  async getBanks(): Promise<Bank[]> {
    const { data }: { data: BankResponse } = await this.httpService
      .get(`${this.config.url}/groups-${this.config.id}0.js?json`)
      .toPromise();
    const excludeIds = [166, 106, 109, 148, 157, 163, 150, 103]; // we use only banks to simplify process

    const banks: Bank[] = [];

    Object.keys(data).forEach((key) => {
      const id: number = +key;
      if (!excludeIds.includes(id)) {
        const bank: Bank = { id, ...data[id] };
        banks.push(bank);
      }
    });
    return banks;
  }

  async createTransaction(
    transactionDto: TransactionDto,
    user: User,
  ): Promise<string> {
    const {
      id,
      api_password,
      api_key,
      security_code,
      result_email,
      result_url,
      return_url,
      return_error_url,
    } = this.config;
    const { amount, bank_id, extension_days, offer_id } = transactionDto;
    const crc = crypto.randomBytes(64).toString('hex');
    const company = await this.companiesService.findByUserId(user.id);
    const requestBody = {
      id: +id,
      api_password,
      api_key,
      security_code,
      result_email,
      result_url,
      return_url,
      return_error_url,
      email: user.email,
      amount: +amount,
      group: +bank_id,
      crc,
      md5sum: md5(String(id) + String(amount) + crc + security_code),
      description: `${t.tpayDescription} ${extension_days} ${t.tpayDescription2}`,
      merchant_description: 'Healthcare Hireos',
      name: company.name,
      language: 'PL',
    };

    const { data } = await this.httpService
      .post(
        `${this.config.url}/api/gw/${api_key}/transaction/create`,
        requestBody,
      )
      .toPromise();

    const payment = await this.paymentRepository
      .create({
        title: data.title,
        crc,
        amount,
        extension_days: extension_days,
        offer_id: offer_id,
        status: PaymentStatus.SUCCESS,
      }).save();

    payment.offer.extendValidity(payment.extension_days);
    await payment.save();
    return data.url;
  }

  async handleNotification(notificationDto: NotificationDto): Promise<void> {
    const {
      tr_status,
      tr_error,
      tr_crc,
      tr_paid,
      md5sum,
      id,
    } = notificationDto;

    let payment: Payment;

    try {
      if (tr_status !== 'TRUE' || tr_error !== 'none') {
        throw new UnexpectedError();
      }

      payment = await this.paymentRepository.findOne(
        { crc: tr_crc },
        {
          relations: ['offer'],
        },
      );

      if (!payment) {
        throw new CrcNotFoundError();
      }
      if (
        md5sum !==
        md5(
          String(id) +
          String(payment.amount) +
          payment.crc +
          this.config.security_code,
        )
      ) {
        throw new IncorrectMd5Error();
      }
      if (+tr_paid !== +payment.amount) {
        throw new IncorrectTrPaidError();
      }
    } catch (error) {
      if (payment) {
        payment.status = PaymentStatus.CANCELED;
        await payment.save();
      }
      throw error;
    }

    payment.status = PaymentStatus.SUCCESS;
    payment.offer.extendValidity(payment.extension_days);
    await payment.save();
  }
}
