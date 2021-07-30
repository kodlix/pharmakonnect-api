/* eslint-disable prettier/prettier */
import { AccountEntity } from 'src/account/entities/account.entity';
import { AbstractBaseEntity } from 'src/_common/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('Outlet')
export class OutletEntity extends AbstractBaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  contactPerson: string;

  @Column({ nullable: true })
  contactPersonEmail: string;

  @Column({ nullable: true })
  contactPersonPhonenumber: string;

  // @Column({ nullable: true })
  // latitude: Number

  // @Column({ nullable: true })
  // longitude: Number;

  @Column({ nullable: true })
  city: string;

  @Column({nullable:true})
  zipCode: Number

  @Column({ nullable: true })
  pcn: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  openingTime: string;

  @Column({ nullable: true })
  closingTime: string;

  @Column({ default: false })
  pcnVerified: boolean;

  @Column({ default: false })
  isHq: boolean;

  @Column({ nullable: true })
  organizationName: string;

  @Column('uuid')
  accountId: string;

  // @Column()
  // country: string;

  // @Column()
  // state: string;

  @Column({ nullable: true })
  countryId: string;

  @Column({ nullable: true })
  countryName: string;

  @Column({ nullable: true })
  stateId: string;

  @Column({ nullable: true })
  stateName: string;

  @Column({ nullable: true })
  lgaId: string;

  @Column({ nullable: true })
  lgaName: string;

  // @Column()
  // lga: string;

  @ManyToOne(() => AccountEntity, (x) => x.outlet)
  account: AccountEntity;

}
