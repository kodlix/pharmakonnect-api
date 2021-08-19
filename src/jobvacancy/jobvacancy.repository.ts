/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository, DeleteResult, ILike, Brackets } from 'typeorm';
import { ApproveJobVacancyDto } from './dto/approve-jobvacancy';
import { CreateJobVacancyDto } from './dto/create-jobvacancy.dto';
import { RejectJobVacancyDto } from './dto/reject-jobvacancy';
import { UpdateJobVacancyDto } from './dto/update-jobvacancy.dto';
import { JobVacancyEntity } from './entities/jobvacancy.entity';
import { AccountEntity } from 'src/account/entities/account.entity';
import { FilterDto } from 'src/_common/filter.dto';
import { LessThanOrEqual } from 'typeorm';
import { MoreThanOrEqual } from 'typeorm';

@EntityRepository(JobVacancyEntity)
export class JobVacancyRepository extends Repository<JobVacancyEntity> {
  async createEntity(
    dto: CreateJobVacancyDto,
    user: AccountEntity,
  ): Promise<JobVacancyEntity> {
    const job = await this.findOne({ where: { jobTitle: dto.jobTitle.toLowerCase(), nameOfCorporation: dto.nameOfCorporation } });
    const today = new Date();

    const jobvacancy = new JobVacancyEntity();

    if (job && job.jobTitle === dto.jobTitle.toLowerCase() && job.nameOfCorporation === dto.nameOfCorporation && job.endDate > today) {
      throw new HttpException(
        `Job with title '${dto.jobTitle}' already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(new Date(dto.yearOfIncorporation).getFullYear())
    if (new Date(dto.yearOfIncorporation).getFullYear() > new Date().getFullYear()) {
      throw new HttpException(
        `Year of Incorporation can not be a future year`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto.yearOfIncorporation < '1900') {
      throw new HttpException(
        `Year of Incorporation can not be a less than 1900 year`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (job && dto.endDate < today) {
      throw new HttpException(
        `End date of Job '${dto.jobTitle}' can not be less than today`,
        HttpStatus.BAD_REQUEST,
      );
    } else if (job && dto.endDate < dto.startDate) {
      throw new HttpException(
        `Start date of Job '${dto.jobTitle}' can not be greater than End date`,
        HttpStatus.BAD_REQUEST,
      );
    } else if (job && dto.maxSalary < dto.minSalary) {
      throw new HttpException(
        `Minimum salary of Job '${dto.jobTitle}' can not be greater than Maximum salary`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto.jobUrl) {
      const isValidUrl = validateUrl(dto.jobUrl);
      if (!isValidUrl) {
        throw new HttpException(`The job url ${dto.jobUrl} is not valid`, HttpStatus.BAD_REQUEST)
      }
    }

    if (dto.companyUrl) {
      const isValidUrl = validateUrl(dto.companyUrl);
      if (!isValidUrl) {
        throw new HttpException(`The company url ${dto.companyUrl} is not valid`, HttpStatus.BAD_REQUEST)
      }
    }
    //const jobvacancy = await this.create();
    jobvacancy.createdBy = user.createdBy;
    jobvacancy.accountId = user.id;
    jobvacancy.companyUrl = dto.companyUrl;
    jobvacancy.contactType = dto.contactType;
    jobvacancy.jobUrl = dto.jobUrl;
    jobvacancy.jobLocation = dto.jobLocation;
    jobvacancy.maxSalary = dto.maxSalary;
    jobvacancy.minSalary = dto.minSalary;
    jobvacancy.companyRegistrationNumber = dto.companyRegistrationNumber;
    jobvacancy.nameOfCorporation = dto.nameOfCorporation;
    jobvacancy.jobDescription = dto.jobDescription;
    jobvacancy.minimumQualification = dto.minimumQualification;
    jobvacancy.otherSkills = dto.otherSkills;
    jobvacancy.jobTitle = dto.jobTitle.toLowerCase();
    jobvacancy.startDate = dto.startDate;
    jobvacancy.endDate = dto.endDate;
    jobvacancy.yearOfIncorporation = dto.yearOfIncorporation;
    jobvacancy.workExperienceInYears = dto.workExperienceInYears;
    console.log('jobvacancy', jobvacancy);

    try {
      const test = await this.save(jobvacancy);
      return test;
    }
    catch (error) {
      console.log(error);

    }

  }

  async updateEntity(
    id: string,
    dto: UpdateJobVacancyDto,
    user: AccountEntity,
  ): Promise<JobVacancyEntity> {
    const jobvacancy = await this.findOne(id);
    console.log('jobvacancy', jobvacancy);
    const job = await this.findOne({ where: { jobTitle: dto.jobTitle, nameOfCorporation: dto.nameOfCorporation } });

    const today = new Date();
    console.log('jobvacancy', jobvacancy);


    if (dto.endDate < today) {
      throw new HttpException(
        `End date of Job '${dto.jobTitle}' can not be less than today`,
        HttpStatus.BAD_REQUEST,
      );
    } else if (dto.endDate < dto.startDate) {
      throw new HttpException(
        `Start date of Job '${dto.jobTitle}' can not be greater than End date`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (new Date(dto.yearOfIncorporation).getFullYear() > new Date().getFullYear()) {
      throw new HttpException(
        `Year of Incorporation can not be a future year`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto.yearOfIncorporation < '1900') {
      throw new HttpException(
        `Year of Incorporation can not be a less than 1900 year`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto.jobUrl) {
      const isValidUrl = validateUrl(dto.jobUrl);
      if (!isValidUrl) {
        throw new HttpException(`The job url ${dto.jobUrl} is not valid`, HttpStatus.BAD_REQUEST)
      }
    }

    if (dto.companyUrl) {
      const isValidUrl = validateUrl(dto.jobUrl);
      if (!isValidUrl) {
        throw new HttpException(`The company url ${dto.companyUrl} is not valid`, HttpStatus.BAD_REQUEST)
      }
    }


    // if (dto.maxSalary < dto.minSalary) {
    //   throw new HttpException(
    //     `Minimum salary of Job '${dto.jobTitle}' can not be greater than Maximum salary`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    jobvacancy.updatedAt = new Date();
    jobvacancy.updatedBy = user.createdBy;
    jobvacancy.accountId = user.id;
    jobvacancy.companyUrl = dto.companyUrl;
    jobvacancy.contactType = dto.contactType;
    jobvacancy.jobUrl = dto.jobUrl;
    jobvacancy.jobLocation = dto.jobLocation;
    jobvacancy.maxSalary = dto.maxSalary;
    jobvacancy.minSalary = dto.minSalary;
    jobvacancy.companyRegistrationNumber = dto.companyRegistrationNumber;
    jobvacancy.nameOfCorporation = dto.nameOfCorporation;
    jobvacancy.jobDescription = dto.jobDescription;
    jobvacancy.minimumQualification = dto.minimumQualification;
    jobvacancy.otherSkills = dto.otherSkills;
    jobvacancy.jobTitle = dto.jobTitle;
    jobvacancy.startDate = dto.startDate;
    jobvacancy.endDate = dto.endDate;
    jobvacancy.yearOfIncorporation = dto.yearOfIncorporation;
    jobvacancy.workExperienceInYears = dto.workExperienceInYears;
    if (jobvacancy.rejected = true) {
      jobvacancy.rejected = false;
    }

    return await this.save(jobvacancy);
  }
  async updateApprove(
    id: string,
    dto: ApproveJobVacancyDto,
  ): Promise<JobVacancyEntity> {
    const jobvacancy = await this.findOne(id);

    jobvacancy.approvedOn = dto.approvedOn;
    jobvacancy.approvedBy = dto.approvedBy;
    jobvacancy.approved = true;
    jobvacancy.rejected = false;
    return await jobvacancy.save();
  }

  async updateReject(
    id: string,
    dto: RejectJobVacancyDto,
  ): Promise<JobVacancyEntity> {
    const jobvacancy = await this.findOne(id);

    jobvacancy.rejected = true;
    jobvacancy.approved = false;
    jobvacancy.rejectedBy = dto.rejectedBy;
    jobvacancy.rejectionMessage = dto.rejectionMessage;

    return await jobvacancy.save();
  }

  async deleteEntity(id: string): Promise<DeleteResult> {
    const jobvacancy = await this.findOne(id);
    return await this.delete({ id: jobvacancy.id });
  }

  async findById(id: string): Promise<JobVacancyEntity> {
    const jobvacancy = await this.findOne(id);
    return jobvacancy;
  }

  async findByAccountId(accountId: string, page = 1): Promise<JobVacancyEntity[]> {
    const jobvacancy = await this.find({
      where: { accountId: accountId },
      order: { approvedOn: 'DESC' },
      take: 25,

      skip: 25 * (page - 1)
    });
    return jobvacancy;
  }

  // async findAll(page = 1): Promise<JobVacancyEntity[]> {
  //   const jobvacancy = await this.find({ where: 
  //     { approved: true },
  //    order: { approvedOn: 'ASC' },
  //   take: 25,
  //   skip: 25 * (page - 1),});

  //   return jobvacancy;
  // }


  async findJob(search: string, page: number): Promise<JobVacancyEntity[]> {


    const today = new Date();
    if(search) {

      const jobList =  await this.createQueryBuilder("job")
               .where(new Brackets(qb => {
                   qb.where("job.nameOfCorporation ILike :nameOfCorporation", { nameOfCorporation: `%${search}%` })
                   .orWhere("job.jobTitle ILike :jobTitle", { jobTitle: `%${search}%` })
                   .orWhere("job.jobLocation ILike :jobLocation", { jobLocation: `%${search}%` })
                   .orWhere("job.contactType ILike :contactType", { contactType: `%${search}%` })
               }))
               .andWhere("job.approved = true")
               .andWhere("job.rejected = false")
               .andWhere("job.startDate <= NOW()")
               .andWhere("job.endDate >= NOW()")
               .orderBy("job.approvedOn", "DESC")
               .take(25)
               .skip(25 * (page ? page - 1 : 0))
               .getMany();

       return jobList;
   }

   return await this.find({where: {approved: true, rejected: false, startDate:LessThanOrEqual(today),endDate:MoreThanOrEqual(today)}, 
                                 order: { approvedOn: 'DESC' }, 
                                 take: 25, 
                                 skip: page ? 25 * (page - 1) : 0});

   
  }
  async findAllJob(search: string, page: number): Promise<JobVacancyEntity[]> {


    if(search) {

      const jobList =  await this.createQueryBuilder("job")
               .where(new Brackets(qb => {
                   qb.where("job.nameOfCorporation ILike :nameOfCorporation", { nameOfCorporation: `%${search}%` })
                   .orWhere("job.jobTitle ILike :jobTitle", { jobTitle: `%${search}%` })
                   .orWhere("job.jobLocation ILike :jobLocation", { jobLocation: `%${search}%` })
                   .orWhere("job.contactType ILike :contactType", { contactType: `%${search}%` })
               }))
               .orderBy("job.createdAt", "DESC")
               .take(25)
               .skip(25 * (page ? page - 1 : 0))
               .getMany();

       return jobList;
   }

   return await this.find({ 
    order: { createdAt: 'DESC' }, 
    take: 25, 
    skip: page ? 25 * (page - 1) : 0});

   
  }

}

function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

// function validateUrl(value) {
//   var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
//     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//     '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//     '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//   return !!pattern.test(value);
// }