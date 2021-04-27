import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Offer } from "../offers/entities/offer.entity";
import PaymentStatus from "./paymentStatus.enum";

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  crc: string;

  @Column({ type: 'money' })
  amount: number;

  @Column()
  extension_days: number;

  @Column()
  status: PaymentStatus

  @Column()
  offer_id: number

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Offer, (offer) => offer.payments)
  @JoinColumn({ name: 'offer_id' })
  offer: Offer;


}