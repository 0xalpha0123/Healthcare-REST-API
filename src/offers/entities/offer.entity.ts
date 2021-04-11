import { IsOptional } from 'class-validator';
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

  @IsOptional()
  @Column()
  paid_till: Date;

  @Column({ default: false })
  active: boolean;

  @ManyToOne(() => AgreementType, (agreementType) => agreementType.offers)
  @JoinColumn({ name: 'agreement_type_id' })
  agreement_type: AgreementType[];

  @ManyToOne(() => Profession, (profession) => profession.offers)
  @JoinColumn({ name: 'profession_id' })
  profession: Profession[];

  @ManyToOne(() => Specialization, (specialization) => specialization.offers)
  @JoinColumn({ name: 'specializtion_id' })
  specialization: Specialization[];

  @Column()
  company_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
