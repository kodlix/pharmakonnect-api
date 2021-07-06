import { IsEmail, IsFQDN, Length } from 'class-validator';
import { AbstractBaseEntity } from 'src/_common/base.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JobVacancyEntity } from "src/jobvacancy/entities/jobvacancy.entity";
import { ScheduleMeetingEntity } from "src/video-conferencing/schedule-meetings/entities/schedule-meeting.entity";
import { OutletEntity } from 'src/outlet/entity/outlet.entity';
import { ArticleEntity } from "src/blog/article/entities/article.entity";
import { PollEntity } from 'src/poll/entities/poll.entity';
import { FeatureEntity } from 'src/features/entity/feature.entity';
import { PackageFeatureEntity } from 'src/package/entities/packagefeature.entity';
import { AdvertEntity } from 'src/advert/entity/advert.entity';
import { CountryEntity } from 'src/country/entities/country.entity';
import { StateEntity } from 'src/state/entities/state.entity';
import { LgaEntity } from 'src/lga/entities/lga.entity';

@Entity('Account')
export class AccountEntity extends AbstractBaseEntity {
  @IsEmail()
  @Length(128)
  @Column({ unique: true, length: 128 })
  public email: string;

  @Column()
  public password: string;

  @Length(128)
  @Column({ length: 128 })
  public accountType: string;

  @Length(128)
  @Column({ length: 128 })
  public accountPackage: string;

  @Length(128)
  @Column({ length: 128, nullable: true })
  public accountStatus: string;

  @Column({ type: 'bool', default: false })
  public isLocked: boolean;

  @Column({ type: 'bool', default: true })
  public isActive: boolean;

  @Column({ type: 'bool', default: false })
  public pcnVerified: boolean;

  @Column({ type: 'bool', default: false })
  public isReported: boolean;

  @Length(128)
  @Column({ length: 128, nullable: true })
  public phoneNumber: string;

  @Length(128)
  @Column({ length: 128, nullable: true })
  public country: string;

  @Length(128)
  @Column({ length: 128, nullable: true })
  public state: string;

  @Length(200)
  @Column({ length: 200, nullable: true })
  public lga: string;

  @Length(200)
  @Column({ length: 200, nullable: true })
  public city: string;

  @Length(200)
  @Column({ length: 200, nullable: true })
  public address: string;

  @Length(50)
  @Column({ nullable: true, length: 50 })
  public pcn: string;

  @Length(50)
  @Column({ nullable: true, length: 50 })
  public typesOfPractice: string;

  @Length(128)
  @Column({ nullable: true, length: 128 })
  public sectorId: string;

  @Column({ type: 'float', default: 0 })
  public longitude: number;

  @Column({ type: 'float', default: 0 })
  public latitude: number;

  @Column({ nullable: true })
  public profileImage: string;

  @Column({ type: 'bool', default: false })
  public isRegComplete: boolean;

  // individual
  @Length(256)
  @Column({ length: 256, nullable: true })
  public firstName: string;

  @Length(256)
  @Column({ length: 256, nullable: true })
  public lastName: string;

  @Column({ type: 'date', nullable: true })
  public dateOfBirth: Date;

  @Column({ type: 'bool', default: false })
  public isPracticing: boolean;

  @Length(20)
  @Column({ length: 20, nullable: true })
  public gender: string;

  // co-operation
  @Length(256)
  @Column({ length: 256, nullable: true })
  public organizationName: string;

  @Length(128)
  @Column({ length: 128, nullable: true })
  public organizationType: string;

  @Column({ type: 'int', default: 0 })
  public numberofEmployees: number;

  @Column({ nullable: true })
  public premisesImage: string;

  @Length(50)
  @Column({ length: 50, default: '' })
  public companyRegistrationNumber?: string;

  @Column({ type: 'int', default: 0 })
  public yearofEstablishment: number;

  @Column('time', { default: (): string => 'LOCALTIMESTAMP' })
  public openingTime: Date;

  @Column('time', { default: (): string => 'LOCALTIMESTAMP' })
  public closingTime: Date;

  @IsFQDN()
  @Column({ nullable: true })
  public website: string;

  @Column()
  public salt: string;

  @Column({ type: 'bool', default: false })
  public emailVerified: boolean;

  @Column({ nullable: true })
  public emailToken: string;

  @OneToMany(() => JobVacancyEntity, (s) => s.account)
  jobVacancy: JobVacancyEntity[];

  @OneToMany(() => AdvertEntity, (s) => s.account)
  advert: AdvertEntity[];

  @OneToMany(() => FeatureEntity, (s) => s.account)
  feature: FeatureEntity[];

  @OneToMany(() => FeatureEntity, (s) => s.account)
  package: PackageFeatureEntity[];

  @OneToMany(() => OutletEntity, (x) => x.account)
  outlet: OutletEntity[];

  @OneToMany(() => ScheduleMeetingEntity, s => s.account)
  meeting: ScheduleMeetingEntity[];

  @OneToMany(type => ArticleEntity, article => article.author)
  articles?: ArticleEntity[];

  @OneToMany(() => PollEntity, p => p.account)
  polls: PollEntity[];

  @ManyToOne(() => CountryEntity, p => p.accounts)
  _country: CountryEntity;

  @ManyToOne(() => StateEntity, p => p.accounts)
  _state: StateEntity;

  @ManyToOne(() => LgaEntity, p => p.accounts)
  _lga: LgaEntity;

  public async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

}
