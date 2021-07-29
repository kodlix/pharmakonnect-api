import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AccountRepository } from 'src/account/account.repository';
import { NotificationType } from 'src/enum/enum';
import { EventEntity } from 'src/events/event/entities/event.entity';
import { NotificationGateway } from 'src/gateway/notification.gateway';
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
    
        constructor(connection: Connection, private readonly notiGateway: NotificationGateway) {
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

      const posterInfo = await this.acctRepo.findOne(event.entity.accountId);

      const noti: NotificationRO = {
        message: `Hi there, ${event.entity.createdBy} posted a new event ${event.entity.name.bold()}`,
        senderId: event.entity.accountId,
        recieverId: id,
        createdAt: new Date(),
        isGeneral: false,
        entityId: event.entity.id,
        accountId: id,
        seen: false,
        notificationType: notType,
        senderImageUrl: posterInfo.profileImage ? posterInfo.profileImage : null,
        createdBy: `${event.entity.createdBy}`
      }

      try {
        await this.notiRepo.save(noti);
        this.notiGateway.sendToUser(noti, id);
      } catch (err) {
        Logger.log(err.message)
        console.log(err.message);
        throw new HttpException(`Could not send notification. Error: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);

      }

    
    }
  }