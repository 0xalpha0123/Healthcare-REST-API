import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from 'axios';
import { TpayConfig } from "src/config/configuration";
import { Bank, BankWithNoId } from "./bank.interface";

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) {
    const tpayConfig = this.configService.get('tpay');
    this.config = tpayConfig;
    this.api = axios.create({
      baseURL: tpayConfig.url,
    });
  }
  api: AxiosInstance
  config: TpayConfig
  async getBanks(): Promise<Bank> {
    const { data } = await this.api.get(`/groups-${this.config.id}0.js?json`);
    const excludeIds = [166, 106, 109, 148, 157, 163, 150, 103]; // we use only banks to simplify process
    const banks: Bank[] = [];
    Object.keys(data).forEach(key => {
      const id: number = +key;
      if (!excludeIds.includes(id)) {
        const bank: Bank = { id, ...data[id] }
        banks.push(bank)
      }
    })
    return banks;
  }
}