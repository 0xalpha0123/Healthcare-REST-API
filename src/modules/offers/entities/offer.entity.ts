import { Candidate } from 'src/modules/candidates/entities/candidate.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { CompanyLocation } from 'src/modules/companies/entities/companyLocation.entity';
import { Payment } from 'src/modules/payments/payment.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AgreementType } from './agreementType.entity';
import { Profession } from './profession.entity';
import { Specialization } from './specialization.entity';

@Entity()
export class Offer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  salary_from: number;

  @Column({ nullable: true })
  salary_to: number;

  @Column({ nullable: true })
  paid_till: Date;

  @Column({ default: false })
  active: boolean;

  @Column()
  profession_id: number;

  @Column({ nullable: true })
  specialization_id: number;

  @Column()
  company_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToMany(() => AgreementType, (agreementType) => agreementType.offers)
  @JoinTable()
  agreement_types: AgreementType[];
  @ManyToMany(() => CompanyLocation, (companyLocation) => companyLocation.offers)
  @JoinTable()
  locations: CompanyLocation[];

  @ManyToOne(() => Specialization, (specialization) => specialization.offers)
  @JoinColumn({ name: 'specialization_id' })
  specialization: Specialization;

  @ManyToOne(() => Profession, (profession) => profession.offers)
  @JoinColumn({ name: 'profession_id' })
  profession: Profession;

  @ManyToOne(() => Company, (company) => company.offers)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Candidate, (candidate) => candidate.offer)
  candidates: Candidate[];

  @OneToMany(
    () => Payment,
    (payment) => payment.offer)
  payments: Payment[];

  extendValidity(days: number) {
    let paidTill = this.paid_till ? new Date(this.paid_till) : new Date();
    paidTill.setDate(paidTill.getDate() + days);
    this.paid_till = paidTill;
  }
}
