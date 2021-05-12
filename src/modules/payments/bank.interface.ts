export interface Bank extends BankWithNoId {
  id: number;
}

export interface BankWithNoId {
  name: string;
  banks: string;
  img: string;
  main_bank_id: string;
}

export interface BankResponse {
  [key: string]: BankWithNoId;
}
