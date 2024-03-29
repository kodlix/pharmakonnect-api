/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { FilterDto } from 'src/_common/filter.dto';
import { DeleteResult } from 'typeorm';
import { ApproveJobVacancyDto } from './dto/approve-jobvacancy';
import { CreateJobVacancyDto } from './dto/create-jobvacancy.dto';
import { RejectJobVacancyDto } from './dto/reject-jobvacancy';
import { UpdateJobVacancyDto } from './dto/update-jobvacancy.dto';
import { JobVacancyRO } from './jobvacancy.interface';
import { JobVacancyRepository } from './jobvacancy.repository';

@Injectable()
export class JobVacancyService {
  constructor(private readonly jobvacancyRepository: JobVacancyRepository) {}

  async create(
    dto: CreateJobVacancyDto,
    user: AccountEntity,
  ): Promise<JobVacancyRO> {
    return await this.jobvacancyRepository.createEntity(dto, user);
  }

  // async findAll(page): Promise<JobVacancyRO[]> {
  //   return await this.jobvacancyRepository.findAll(page);
  // }

  async findJob(search: string, page: number): Promise<JobVacancyRO[]> {
    return await this.jobvacancyRepository.findJob(search, page);
}

  async findOne(id: string): Promise<JobVacancyRO> {
    return await this.jobvacancyRepository.findById(id);
  }

  async findByAccountId(accountId: string,page): Promise<JobVacancyRO[]> {
    return await this.jobvacancyRepository.findByAccountId(accountId,page);
  }

  async update(id: string, dto: UpdateJobVacancyDto, user: AccountEntity): Promise<JobVacancyRO> {
    return await this.jobvacancyRepository.updateEntity(id, dto, user);
  }

  async updateApprove(
    id: string,
    dto: ApproveJobVacancyDto,
  ): Promise<JobVacancyRO> {
    return await this.jobvacancyRepository.updateApprove(id, dto);
  }

  async updateReject(
    id: string,
    dto: RejectJobVacancyDto,
  ): Promise<JobVacancyRO> {
    return await this.jobvacancyRepository.updateReject(id, dto);
  }

  async remove(id: string) {
    return await this.jobvacancyRepository.deleteEntity(id);
  }
}
