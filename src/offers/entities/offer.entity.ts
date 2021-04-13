import { IsOptional } from 'class-validator';
import { Company } from 'src/companies/entities/company.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AgreementType } from './agreement_type.entity';
import { Profession } from './profession.entity';
import { Specialization } from './specialization.entity';

@Entity()
export class Offer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @IsOptional()
  @Column()
  description: string;

  @IsOptional()
  @Column()
  salary_from: number;

  @IsOptional()
  @Column()
  salary_to: number;

  @Column()
  paid_till: Date;

  @Column({ default: false })
  active: boolean;

  @Column({ nullable: true })
  agreement_type_id: number;

  @ManyToOne(() => AgreementType, (agreementType) => agreementType.offers)
  @JoinColumn({ name: 'agreement_type_id' })
  agreement_type: AgreementType;

  @Column({ nullable: true })
  profession_id: number;

  @ManyToOne(() => Profession, (profession) => profession.offers)
  @JoinColumn({ name: 'profession_id' })
  profession: Profession;

  // remove nullable
  @Column({ nullable: true })
  specialization_id: number;

  @ManyToOne(() => Specialization, (specialization) => specialization.offers)
  @JoinColumn({ name: 'specializtion_id' })
  specialization: Specialization;

  @Column()
  company_id: number;

  @ManyToOne(() => Company, (company) => company.offers)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
