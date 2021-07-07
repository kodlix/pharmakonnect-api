import { Logger } from '@nestjs/common';
import { AccountRepository } from 'src/account/account.repository';
import { ArticleEntity } from 'src/blog/article/entities/article.entity';
import { NotificationType } from 'src/enum/enum';
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
  export class BlogSubscriber implements EntitySubscriberInterface<ArticleEntity> {
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
      return ArticleEntity;
    }
  
    async afterInsert(event: InsertEvent<ArticleEntity>) {

      const {id} = await this.acctRepo.findOne({where: {email: "admin@netopng.com"}});
      
      const notType = await this.notTypeRepo.findOne({where: {name: NotificationType.BLOG}});
      

      const noti: NotificationRO = {
        message: `Hi there, ${event.entity.author.firstName} posted a new blog ${event.entity.title}`,
        senderId: event.entity.author.id,
        recieverId: id,
        entityId: event.entity.id,
        isGeneral: false,
        accountId: id,
        seen: false,
        notificationType: notType,
        senderImageUrl: event.entity.author.profileImage ? event.entity.author.profileImage : null,
        createdBy: `${event.entity.author.firstName} ${event.entity.author.lastName}`
      }

      try {
        await this.notiRepo.save(noti);

      } catch (err) {
        Logger.log(err.message)
        console.log(err.message);
      }


    }
  }