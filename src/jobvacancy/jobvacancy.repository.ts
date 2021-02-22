/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { Repository, EntityRepository, DeleteResult } from 'typeorm';
import { ApproveJobVacancyDto } from './dto/approve-jobvacancy';
import { CreateJobVacancyDto } from './dto/create-jobvacancy.dto';
import { RejectJobVacancyDto } from './dto/reject-jobvacancy';
import { UpdateJobVacancyDto } from './dto/update-jobvacancy.dto';
import { JobVacancyEntity } from './entities/jobvacancy.entity';


@EntityRepository(JobVacancyEntity)
export class JobVacancyRepository extends Repository<JobVacancyEntity> {
    async createEntity(dto: CreateJobVacancyDto, user: AccountEntity): Promise<JobVacancyEntity> {

        const job = await this.findOne({ where: { jobTitle: dto.jobTitle } });
        const today = new Date();
        if (job && dto.endDate < today) {

            throw new HttpException({ error: `End date of Job '${dto.jobTitle}' can not be less than today` }, HttpStatus.BAD_REQUEST);
        }

        else if (job && dto.endDate < dto.startDate) {
            throw new HttpException({ error: `Start date of Job '${dto.jobTitle}' can not be greater than End date` }, HttpStatus.BAD_REQUEST);
        }
        const jobvacancy = new JobVacancyEntity();
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
        jobvacancy.jobTitle = dto.jobTitle;
        jobvacancy.startDate = dto.startDate;
        jobvacancy.endDate = dto.endDate;
        jobvacancy.yearOfIncorporation = dto.yearOfIncorporation;
        jobvacancy.workExperienceInYears = dto.workExperienceInYears;

        return await this.save(jobvacancy);
    }

    async updateEntity(id: string, dto: UpdateJobVacancyDto): Promise<JobVacancyEntity> {

        const jobvacancy = await this.findOne(id);

        jobvacancy.updatedAt = new Date();
        jobvacancy.updatedBy = dto.updatedBy;
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
        return await jobvacancy.save();
    }
    async updateApprove(id: string, dto: ApproveJobVacancyDto): Promise<JobVacancyEntity> {
        const jobvacancy = await this.findOne(id);

        jobvacancy.approvedOn = dto.approvedOn;
        jobvacancy.approvedBy = dto.approvedBy;
        jobvacancy.approved = true;
        jobvacancy.rejected = false;
        return await jobvacancy.save()
    }

    async updateReject(id: string, dto: RejectJobVacancyDto): Promise<JobVacancyEntity> {
        const jobvacancy = await this.findOne(id);

        jobvacancy.rejected = true;
        jobvacancy.approved = false;
        jobvacancy.rejectedBy = dto.rejectedBy;
        jobvacancy.rejectionMessage = dto.rejectionMessage;

        return await jobvacancy.save()
    }

    async deleteEntity(id: string): Promise<DeleteResult> {

        const jobvacancy = await this.findOne(id);
        return await this.delete({ id: jobvacancy.id });

    }

    async findById(id: string): Promise<JobVacancyEntity> {

        const jobvacancy = await this.findOne(id);
        return jobvacancy;
    }

    async findByAccountId(accountId: string): Promise<JobVacancyEntity[]> {

        const jobvacancy = await this.find({ where: { accountId: accountId }, order: { approvedOn: 'DESC' } });
        return jobvacancy;
    }


    async findAll(): Promise<JobVacancyEntity[]> {
        const jobvacancy = await this.find({ order: { approvedOn: 'DESC' } });
        return jobvacancy;
    }
}