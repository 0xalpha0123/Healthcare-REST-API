import { Offer } from './offer.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Specialization } from './specialization.entity';

@Entity()
export class Profession extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Offer, (offer) => offer.profession, { cascade: true })
  offers: Offer[];

  @OneToMany(
    () => Specialization,
    (specialization) => specialization.profession,
    { cascade: true },
  )
  specializations: Specialization[];
}
