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
import { Company } from './company.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class CompanyLocation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional()
  @Column({ nullable: true })
  name: string;

  @Column({ type: 'point' })
  coordinates: string;

  @Column()
  city: string;

  @Column()
  postcode: string;

  @Column()
  street: string;

  @Column()
  building_number: number;

  @IsOptional()
  @Column({ nullable: true })
  room_number: number;

  @ManyToOne(() => Company, (company) => company.locations)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
