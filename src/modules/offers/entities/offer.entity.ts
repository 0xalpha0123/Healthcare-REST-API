import { Company } from 'src/modules/companies/entities/company.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
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

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({nullable: true})
  salary_from: number;

  @Column({nullable: true})
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
  @JoinColumn({ name: 'agreement_type_id' })
  agreement_types: AgreementType[];

  @ManyToOne(() => Specialization, (specialization) => specialization.offers)
  @JoinColumn({ name: 'specialization_id' })
  specialization: Specialization;

  @ManyToOne(() => Profession, (profession) => profession.offers)
  @JoinColumn({ name: 'profession_id' })
  profession: Profession;

  @ManyToOne(() => Company, (company) => company.offers)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
