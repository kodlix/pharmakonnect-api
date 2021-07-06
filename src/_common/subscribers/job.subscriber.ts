import { AccountRepository } from 'src/account/account.repository';
import { NotificationType } from 'src/enum/enum';
import { JobVacancyEntity } from 'src/jobvacancy/entities/jobvacancy.entity';
import { NotificationRO } from 'src/notifications/notification/interface/notification.interface';
import { NotificationRepository } from 'src/notifications/notification/notification.repository';
import { NotificationTypeRepository } from 'src/notifications/notificationtype/notificationtype.repository';
import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
  } from 'typeorm';
  
  @EventSubscriber()
  export class JobSubscriber implements EntitySubscriberInterface<JobVacancyEntity> {
    private  acctRepo: AccountRepository;
    private  notTypeRepo: NotificationTypeRepository;
    private  notiRepo: NotificationRepository

    constructor(connection: Connection) {
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

      const noti: NotificationRO = {
        message: `Hi there, ${event.entity.createdBy} posted a new Job vacancy ${event.entity.jobTitle}`,
        senderId: event.entity.accountId,
        entityId: event.entity.id,
        recieverId: id,
        isGeneral: false,
        accountId: id,
        seen: false,
        notificationType: notType,
        createdBy: `${event.entity.createdBy}`
      }

      await this.notiRepo.save(noti);
    }
  }