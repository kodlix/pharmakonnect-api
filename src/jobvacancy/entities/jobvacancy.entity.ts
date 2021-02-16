/* eslint-disable prettier/prettier */
import { Column, Entity } from 'typeorm';
import { AbstractBaseEntity } from 'src/_common/base.entity';

@Entity('JobVacancy')
export class JobVacancyEntity extends AbstractBaseEntity {
  @Column({unique : false, nullable: true})
  sectorId : string;

  @Column({nullable: true})
  nameOfCorporation: string;

  @Column({nullable: true})
  yearOfIncorporation: Date;

  @Column({nullable: true})
  companyRegistrationNumber: number;

  @Column({nullable: true})
  companyUrl: string;

  @Column({nullable: true})
  jobDescription: string;

  @Column({nullable: true})
  minimumQualification: string;

  @Column({nullable: true})
  jobTitle: string;

  @Column({nullable: true})
  workExperienceInYears: string;

  @Column({nullable: true})
  jobLocation: string;

  @Column({nullable: true})
  otherSkills: string;

  @Column({nullable: true})
  minSalary: number;

  @Column({nullable: true})
  maxSalary: number;
  
  @Column({nullable: true})
  startDate: Date;

  @Column({nullable: true})
  endDate: Date;

  @Column({nullable: true})
  jobUrl: string;

  @Column({nullable: true})
  contactType: string;

  @Column({default: null,nullable: true})
  approvedOn: Date;

  @Column({default:null, nullable: true})
  approvedBy: string;

  @Column({default: false})
  approved: boolean;

  @Column({default: false})
  rejected: boolean;

  @Column({nullable: true})
  rejectedBy: string;

  @Column({nullable: true})
  rejectionMessage: string;

}
