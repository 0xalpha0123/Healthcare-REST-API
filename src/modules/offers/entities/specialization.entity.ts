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

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Profession, (profession) => profession.offers)
  @JoinColumn({ name: 'profession_id' })
  profession: Profession;

  @Column({ nullable: false })
  profession_id: number;

  @Column({ default: false })
  is_promoted: boolean;

  @OneToMany(() => Offer, (offer) => offer.specialization, { cascade: true })
  offers: Offer[];
}
