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
import { Company } from './company.entity';
import { Coordinates } from '../../../common/interfaces/coordinates.interface';
import { PointTransformer } from '../../../common/transformers/point.transformer';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class CompanyLocation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'point',
    transformer: new PointTransformer(),
  })
  coordinates: Coordinates;

  @Column()
  city: string;

  @Column()
  postcode: string;

  @Column()
  street: string;

  @Column()
  building_number: number;

  @Column({ nullable: true })
  room_number: number;

  @Column()
  company_id: number;

  @ManyToOne(() => Company, (company) => company.locations)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToMany(() => Offer, (offer) => offer.agreement_types, { cascade: true })
  offers: Offer[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  constructor(partial: Partial<CompanyLocation>) {
    super();
    Object.assign(this, partial);
  }
}
