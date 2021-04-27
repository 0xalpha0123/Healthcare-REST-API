import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
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


@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService, @InjectRepository(Payment)
  private paymentRepository: Repository<Payment>) {
    const tpayConfig = this.configService.get('tpay');
    this.config = tpayConfig;
    this.api = axios.create({
      baseURL: tpayConfig.url,
    });
  }
  api: AxiosInstance;
  config: TpayConfig;

  async getBanks(): Promise<Bank[]> {
    const { data }: { data: BankResponse } = await this.api.get(
      `/groups-${this.config.id}0.js?json`,
    );
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
    const { data } = await this.api.post(`/api/gw/${api_key}/transaction/create`, requestBody);
    await this.paymentRepository.create({ title: data.title, crc, amount, extension_days: extensionDays, offer_id: offerId, status: PaymentStatus.IN_PROGRESS }).save()
    return data.url;
  }
}
