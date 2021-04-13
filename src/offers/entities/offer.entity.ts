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
import { AgreementType } from './agreementType.entity';
import { Profession } from './profession.entity';
import { Specialization } from './specialization.entity';

@Entity()
export class Offer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
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

  @Column({ nullable: false })
  paid_till: Date;

  @Column({ default: false })
  active: boolean;

  @Column({ nullable: false })
  agreement_type_id: number;

  @ManyToOne(() => AgreementType, (agreementType) => agreementType.offers)
  @JoinColumn({ name: 'agreement_type_id' })
  agreement_type: AgreementType;

  @Column({ nullable: false })
  profession_id: number;

  @ManyToOne(() => Profession, (profession) => profession.offers)
  @JoinColumn({ name: 'profession_id' })
  profession: Profession;

  @Column({ nullable: false })
  specialization_id: number;

  @ManyToOne(() => Specialization, (specialization) => specialization.offers)
  @JoinColumn({ name: 'specializtion_id' })
  specialization: Specialization;

  @Column({ nullable: false })
  company_id: number;

  @ManyToOne(() => Company, (company) => company.offers)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
