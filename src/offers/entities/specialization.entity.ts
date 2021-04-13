import { Offer } from './offer.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profession } from './profession.entity';

@Entity()
export class Specialization extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Profession, (profession) => profession.offers)
  @JoinColumn({ name: 'profession_id' })
  profession: Profession;

  @Column()
  profession_id: number;

  @OneToMany(() => Offer, (offer) => offer.specialization, { cascade: true })
  offers: Offer[];
}
