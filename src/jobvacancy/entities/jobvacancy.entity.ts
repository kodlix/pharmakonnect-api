/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from 'src/_common/base.entity';
import { AccountEntity } from 'src/account/entities/account.entity';

@Entity('JobVacancy')
export class JobVacancyEntity extends AbstractBaseEntity {
  @Column({ unique: false, nullable: true })
  sectorId: string;

  @Column({ nullable: true })
  nameOfCorporation: string;

  @Column({nullable: true})
  yearOfIncorporation: string;

  @Column({ nullable: true })
  companyRegistrationNumber: string;

  @Column({ nullable: true })
  companyUrl: string;

  @Column({ nullable: true })
  jobDescription: string;

  @Column({ nullable: true })
  minimumQualification: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  workExperienceInYears: number;

  @Column({ nullable: true })
  jobLocation: string;

  @Column({ nullable: true })
  otherSkills: string;

  @Column({ nullable: true })
  minSalary: number;

  @Column({ nullable: true })
  maxSalary: number;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  jobUrl: string;

  @Column({ nullable: true })
  contactType: string;

  @Column({ default: null, nullable: true })
  approvedOn: Date;

  @Column({ default: null, nullable: true })
  approvedBy: string;

  @Column({ default: false })
  approved: boolean;

  @Column({ default: false })
  rejected: boolean;

  @Column({ nullable: true })
  rejectedBy: string;

  @Column({ nullable: true })
  rejectionMessage: string;

  @ManyToOne(() => AccountEntity, (s) => s.jobVacancy)
  account: AccountEntity;

  @Column('uuid')
  accountId: string;
}
