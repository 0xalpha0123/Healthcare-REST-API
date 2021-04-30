import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
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


@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService, @InjectRepository(Payment)
  private paymentRepository: Repository<Payment>, private httpService: HttpService) {
    this.config = this.configService.get('tpay');
  }
  config: TpayConfig;

  async getBanks(): Promise<Bank[]> {
    const { data }: { data: BankResponse } = await this.httpService.get(
      `${this.config.url}/groups-${this.config.id}0.js?json`,
    ).toPromise();
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

  async createTransaction(transactionDto: TransactionDto): Promise<String> {
    const {
      id,
      api_password,
      api_key,
      security_code,
      result_email,
      result_url,
      return_url,
      return_error_url
    } = this.config;
    const { amount, bankId, extensionDays, companyName, userEmail, offerId } = transactionDto;
    const crc = crypto.randomBytes(64).toString('hex');

    const requestBody = {
      id: +id,
      api_password,
      api_key,
      security_code,
      result_email,
      result_url,
      return_url,
      return_error_url,
      email: userEmail,
      amount: +amount,
      group: +bankId,
      crc,
      md5sum: md5(String(id) + String(amount) + crc + security_code),
      description: `${t.tpayDescription} ${extensionDays} ${t.tpayDescription2}`,
      merchant_description: 'Healthcare Hireos',
      name: companyName,
      language: 'PL'
    };

    const { data } = await this.httpService.post(`${this.config.url}/api/gw/${api_key}/transaction/create`, requestBody).toPromise();
    await this.paymentRepository.create({ title: data.title, crc, amount, extension_days: extensionDays, offer_id: offerId, status: PaymentStatus.IN_PROGRESS }).save()
    return data.url;
  }



  async handleNotification(notificationDto: NotificationDto): Promise<void> {
    const { tr_status, tr_error, tr_crc, tr_paid, md5sum, id } = notificationDto;

    let payment: Payment;

    try {
      if (tr_status !== 'TRUE' || tr_error !== 'none') {
        throw new Error('Unexpected error');
      }

      payment = await this.paymentRepository.findOne({ crc: tr_crc }, {
        relations: ['offer'],
      });

      if (!payment) {
        throw new Error('Payment with provided crc not found');
      }
      if (md5sum !== md5(String(id) + String(payment.amount) + payment.crc + this.config.security_code)) {
        throw new Error('Incorrect md5sum value');
      }
      if (+tr_paid !== +payment.amount) {
        throw new Error('Incorrect tr_paid value');
      }

    } catch (error) {
      if (payment) {
        payment.status = PaymentStatus.CANCELED;
        await payment.save();
      }
      throw new BadRequestException(error);
    }

    payment.status = PaymentStatus.SUCCESS;
    payment.offer.extendValidity(payment.extension_days);
    await payment.save();
  }
}
