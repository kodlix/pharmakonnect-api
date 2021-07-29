import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AccountRepository } from 'src/account/account.repository';
import { AdvertEntity } from 'src/advert/entity/advert.entity';
import { NotificationType } from 'src/enum/enum';
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
  export class AdvertSubscriber implements EntitySubscriberInterface<AdvertEntity> {

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
      return AdvertEntity;
    }
  
    async afterInsert(event: InsertEvent<AdvertEntity>) {

      const {id} = await this.acctRepo.findOne({where: {email: "admin@netopng.com"}});
      if(!id) {
          return;
      }

      const notType = await this.notTypeRepo.findOne({where: {name: NotificationType.ADVERT}});

      const posterInfo = await this.acctRepo.findOne(event.entity.accountId);

      const noti: NotificationRO = {
        message: `Hi there, ${event.entity.createdBy} posted a new advert ${event.entity.title.bold()}`,
        senderId: event.entity.accountId,
        recieverId: id,
        isGeneral: false,
        entityId: event.entity.id,
        createdAt: new Date(),
        accountId: id,
        seen: false,
        notificationType: notType,
        senderImageUrl: posterInfo.profileImage ? posterInfo.profileImage : null,
        createdBy: `${event.entity.createdBy}`
      }

      try {
        await this.notiRepo.save(noti);
        this.notiGateway.sendToUser(noti, id)

      } catch (err) {
        Logger.log(err.message)
        console.log(err.message);
        throw new HttpException(`Could not send notification. Error: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

    
    }
  }