import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/user.entity';
import { CompanyPhoto } from './companyPhoto.entity';
import { CompanyLocation } from './companyLocation.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logo_file_path: string;

  @Column({ nullable: true })
  website_url: string;

  @Column({ nullable: false, select: false })
  user_id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CompanyPhoto, (companyPhoto) => companyPhoto.company, {
    cascade: true,
  })
  photos: CompanyPhoto[];

  @OneToMany(
    () => CompanyLocation,
    (companyLocation) => companyLocation.company,
    {
      cascade: true,
    },
  )
  @JoinColumn()
  locations: CompanyLocation[];

  @OneToMany(() => Offer, (offer) => offer.company, { cascade: true })
  offers: Offer[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
