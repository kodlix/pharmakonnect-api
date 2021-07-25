import { Logger } from '@nestjs/common';
import { EQUALS } from 'class-validator';
import { AccountRepository } from 'src/account/account.repository';
import { NotificationType } from 'src/enum/enum';
import { NotificationGateway } from 'src/gateway/notification.gateway';
import { JobVacancyEntity } from 'src/jobvacancy/entities/jobvacancy.entity';
import { NotificationRO } from 'src/notifications/notification/interface/notification.interface';
import { NotificationRepository } from 'src/notifications/notification/notification.repository';
import { NotificationTypeRepository } from 'src/notifications/notificationtype/notificationtype.repository';
import {
    Connection,
    EntitySubscriberInterface,
    Equal,
    EventSubscriber,
    InsertEvent,
    Not,
  } from 'typeorm';
  
  @EventSubscriber()
  export class JobSubscriber implements EntitySubscriberInterface<JobVacancyEntity> {
    private  acctRepo: AccountRepository;
    private  notTypeRepo: NotificationTypeRepository;
    private  notiRepo: NotificationRepository

    constructor(connection: Connection, private readonly notiGateway: NotificationGateway) {
        this.acctRepo = connection.getCustomRepository(AccountRepository);
        this.notTypeRepo = connection.getCustomRepository(NotificationTypeRepository);
        this.notiRepo = connection.getCustomRepository(NotificationRepository);
        connection.subscribers.push(this);
    }
  
    listenTo() {
      return JobVacancyEntity;
    }
  
    async afterInsert(event: InsertEvent<JobVacancyEntity>) {
      console.log(`AFTER JOB INSERTED: `, event.entity);

      const {id} = await this.acctRepo.findOne({where: {email: "admin@netopng.com"}});
      if(!id) {
          return;
      }

      const notType = await this.notTypeRepo.findOne({where: {name: NotificationType.JOB}});
      if(!notType) {
          return;
      }

      const userWhoSub = await this.acctRepo.find({where: {subscribeToJobAlert: true, id: Not(Equal(event.entity.accountId))}});

      const notifications = [];
      const posterInfo = await this.acctRepo.findOne(event.entity.accountId);


      if(userWhoSub.length > 0) {
          for (const u of userWhoSub) {
                const noti: NotificationRO = {
                message: `Hi there, ${event.entity.createdBy} posted a new Job vacancy ${event.entity.jobTitle.bold()}`,
                senderId: event.entity.accountId,
                entityId: event.entity.id,
                recieverId: u.id,
                createdAt: new Date(),
                isGeneral: false,
                accountId: u.id,
                seen: false,
                notificationType: notType,
                senderImageUrl: posterInfo.profileImage ? posterInfo.profileImage : null,
                createdBy: `${event.entity.createdBy}`
            }

            notifications.push(noti);
          }

        try {
            await this.notiRepo.save(notifications);
            for (const u of userWhoSub) {
              const dataToSend = {
                message: `Hi there, ${event.entity.createdBy} posted a new Job vacancy ${event.entity.jobTitle.bold()}`,
                senderId: event.entity.accountId,
                entityId: event.entity.id,
                recieverId: u.id,
                createdAt: new Date(),
                isGeneral: false,
                accountId: u.id,
                seen: false,
                notificationType: notType,
                senderImageUrl: posterInfo.profileImage ? posterInfo.profileImage : null,
                createdBy: `${event.entity.createdBy}`
              }
              this.notiGateway.sendToUser(dataToSend, u.id);
            }
        } catch (err) {
            Logger.log(err.message)
            console.log(err.message);
        }
      }
    }
  }