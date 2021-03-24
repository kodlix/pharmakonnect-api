import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AccountEntity } from 'src/account/entities/account.entity';
import { Repository, EntityRepository, DeleteResult, ILike, MoreThan } from 'typeorm';
import { CreatePollDto } from '../dto/create-poll.dto';
import { UpdatePollDto } from '../dto/update-poll.dto';
import { PollEntity } from '../entities/poll.entity';


@EntityRepository(PollEntity)
export class PollRepository extends Repository<PollEntity> {
  async createEntity(dto: CreatePollDto, user: AccountEntity): Promise<PollEntity> {
    const existingPoll = await this.findOne({ where: { title : dto.title, accountId: user.id, endDate:  MoreThan(new Date()), } });

    const today = new Date();    
    if (existingPoll) {
        throw new HttpException(
            `You have an active poll with same title '${dto.title}' already exisits`,
            HttpStatus.BAD_REQUEST,
          );
    }
   
    if (dto.endDate < today) {
      throw new HttpException(
        `Poll end-date cannot be less than today`,
        HttpStatus.BAD_REQUEST,
      );
    }
    
    if (dto.endDate < dto.startDate) {
      throw new HttpException(
        `Poll end-date cannot be greater than start-date`,
        HttpStatus.BAD_REQUEST,
      );
    } 

    const poll = plainToClass(PollEntity, dto);

    poll.accountId = user.id;
    poll.createdBy = user.email;

    const errors = await validate(poll);

    if(errors.length > 0) {
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    try {        
        return await this.save(poll);
    } catch(error)  {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateEntity(id: string,dto: UpdatePollDto, user: AccountEntity ): Promise<PollEntity> {

    if (!id) {
        throw new HttpException(
            `Invalid poll`,
            HttpStatus.BAD_REQUEST,
          );
    }
    const poll = await this.findOne(id);

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
    return await this.save(jobvacancy);
  }
  async updateApprove(
    id: string,
    dto: ApprovePollDto,
  ): Promise<PollEntity> {
    const jobvacancy = await this.findOne(id);

    jobvacancy.approvedOn = dto.approvedOn;
    jobvacancy.approvedBy = dto.approvedBy;
    jobvacancy.approved = true;
    jobvacancy.rejected = false;
    return await jobvacancy.save();
  }

  async updateReject(
    id: string,
    dto: RejectPollDto,
  ): Promise<PollEntity> {
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

  async findById(id: string): Promise<PollEntity> {
    const jobvacancy = await this.findOne(id);
    return jobvacancy;
  }

  async findByAccountId(accountId: string,page = 1): Promise<PollEntity[]> {
    const jobvacancy = await this.find({
      where: { accountId: accountId },
      order: { approvedOn: 'ASC' },
      take: 25,

      skip: 25 * (page - 1)});
    return jobvacancy;
  }

  async findAll(page = 1): Promise<PollEntity[]> {
    const jobvacancy = await this.find({ order: { approvedOn: 'ASC' },
    take: 25,

    skip: 25 * (page - 1),});
    
    return jobvacancy;
  }


  async findJob(page = 1, searchParam: string): Promise<PollEntity[]> {
    if (searchParam) {
      const param = `%${searchParam}%`
      const searchResult = await this.find({
        where: [
          { nameOfCorporation: ILike(param) },
          { jobTitle: ILike(param) },
          { workExperienceInYears: ILike(param) },
          { jobLocation: ILike(param) },
          { contactType: ILike(param) },
        ],
        order: { createdAt: 'ASC' },
        take: 25,
  
        skip: 25 * (page - 1),
      })

      return searchResult;
    }
    const Poll = await this.find({
      order: { createdAt: 'ASC' },
      take: 25,

      skip: 25 * (page - 1),
    });

    return Poll;
  }
}

function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}