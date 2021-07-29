/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { AccountRepository } from 'src/account/account.repository';
import { AccountEntity } from 'src/account/entities/account.entity';
import { NotificationType } from 'src/enum/enum';
import { NotificationGateway } from 'src/gateway/notification.gateway';
import { NotificationRO } from 'src/notifications/notification/interface/notification.interface';
import { NotificationRepository } from 'src/notifications/notification/notification.repository';
import { NotificationTypeRepository } from 'src/notifications/notificationtype/notificationtype.repository';
import { FilterDto } from 'src/_common/filter.dto';
import { Connection, DeleteResult } from 'typeorm';
import { ApproveJobVacancyDto } from './dto/approve-jobvacancy';
import { CreateJobVacancyDto } from './dto/create-jobvacancy.dto';
import { RejectJobVacancyDto } from './dto/reject-jobvacancy';
import { UpdateJobVacancyDto } from './dto/update-jobvacancy.dto';
import { JobVacancyRO } from './jobvacancy.interface';
import { JobVacancyRepository } from './jobvacancy.repository';

@Injectable()
export class JobVacancyService {
  private  notTypeRepo: NotificationTypeRepository;
  private  notiRepo: NotificationRepository;
  private  acctRepo: AccountRepository;

  constructor(private readonly jobvacancyRepository: JobVacancyRepository, connection: Connection, private readonly notiGateway: NotificationGateway) {
    this.notTypeRepo = connection.getCustomRepository(NotificationTypeRepository);
    this.notiRepo = connection.getCustomRepository(NotificationRepository);
    this.acctRepo = connection.getCustomRepository(AccountRepository);

  }

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
    const result = await this.jobvacancyRepository.updateApprove(id, dto);
    
    // const notType = await this.notTypeRepo.findOne({where: {name: NotificationType.ADVERT}});
        
    // const {id: adminId, profileImage} = await this.acctRepo.findByEmail("admin@netopng.com");
    
    // const noti: NotificationRO = {
    //   message: `Hi ${result.createdBy}, the job you posted has been approved`,
    //   senderId: adminId,
    //   entityId: result.id,
    //   recieverId: result.accountId,
    //   isGeneral: false,
    //   accountId: result.accountId,
    //   createdAt: new Date(),
    //   seen: false,
    //   senderImageUrl: profileImage ? profileImage : null,
    //   notificationType: notType,
    //   createdBy: "admin@netopng.com"
    // }

    // try {
    //   await this.notiRepo.save(noti);
    //   this.notiGateway.sendToUser(noti, result.accountId);
    // } catch (err) {
    //   Logger.log(err);
    //   return result;
    // }

    return result;
  }

  async updateReject(
    id: string,
    dto: RejectJobVacancyDto,
  ): Promise<JobVacancyRO> {
    const result = await this.jobvacancyRepository.updateReject(id, dto);

    // const notType = await this.notTypeRepo.findOne({where: {name: NotificationType.JOB}});
       
    // const {id: adminId, profileImage} = await this.acctRepo.findByEmail("admin@netopng.com");
    
    // const noti: NotificationRO = {
    //   message: `Hi ${result.createdBy}, the job you posted has been rejected`,
    //   senderId: adminId,
    //   entityId: result.id,
    //   recieverId: result.accountId,
    //   isGeneral: false,
    //   accountId: result.accountId,
    //   createdAt: new Date(),
    //   seen: false,
    //   senderImageUrl: profileImage ? profileImage : null,
    //   notificationType: notType,
    //   createdBy: "admin@netopng.com"
    // }

    // try {
    //   await this.notiRepo.save(noti);
    //   this.notiGateway.sendToUser(noti, result.accountId);
    // } catch (err) {
    //   Logger.log(err);
    //   return result;
    // }

    return result;

  }

  async remove(id: string) {
    return await this.jobvacancyRepository.deleteEntity(id);
  }
}
