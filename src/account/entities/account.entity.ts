/* eslint-disable prettier/prettier */
import { IsEmail, IsFQDN, Length } from 'class-validator';
import { AbstractBaseEntity } from 'src/_common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JobVacancyEntity } from "src/jobvacancy/entities/jobvacancy.entity";
import { ScheduleMeetingEntity } from "src/video-conferencing/schedule-meetings/entities/schedule-meeting.entity";
import { OutletEntity } from 'src/outlet/entity/outlet.entity';
import { ArticleEntity } from "src/blog/article/entities/article.entity";

@Entity('Account')
export class AccountEntity extends AbstractBaseEntity {
  // co-operation and individual
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

  @OneToMany(() => OutletEntity, (x) => x.account)
  outlet: OutletEntity[];

  @OneToMany(() => ScheduleMeetingEntity, s => s.account)
  meeting: ScheduleMeetingEntity[];

  @OneToMany(type => ArticleEntity, article => article.author)
  articles?: ArticleEntity[];

  public async validatePassword(password: string): Promise<boolean> {
      const hash = await bcrypt.hash(password, this.salt);
      return hash === this.password;
  }
    
}
