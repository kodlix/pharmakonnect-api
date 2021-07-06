import { AccountRepository } from 'src/account/account.repository';
import { NotificationType } from 'src/enum/enum';
import { EventEntity } from 'src/events/event/entities/event.entity';
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
  export class EveSubscriber implements EntitySubscriberInterface<EventEntity> {

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
      return EventEntity;
    }
  
    async afterInsert(event: InsertEvent<EventEntity>) {

      const {id} = await this.acctRepo.findOne({where: {email: "admin@netopng.com"}});
      if(!id) {
          return;
      }

      const notType = await this.notTypeRepo.findOne({where: {name: NotificationType.EVENT}});

      const noti: NotificationRO = {
        message: `Hi there, ${event.entity.createdBy} posted a new event ${event.entity.name}`,
        senderId: event.entity.accountId,
        recieverId: id,
        isGeneral: false,
        entityId: event.entity.id,
        accountId: id,
        seen: false,
        notificationType: notType,
        createdBy: `${event.entity.createdBy}`
      }

      await this.notiRepo.save(noti);

    
    }
  }