import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventRepository } from './event.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { NotificationTypeRepository } from 'src/notifications/notificationtype/notificationtype.repository';
import { NotificationRepository } from 'src/notifications/notification/notification.repository';
import { AccountRepository } from 'src/account/account.repository';
import { EveSubscriber } from 'src/_common/subscribers/event.subscriber';
import { NotificationGateway } from 'src/gateway/notification.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventRepository]), AccountModule
  ],
  controllers: [EventController],
  providers: [EventService, EveSubscriber, NotificationTypeRepository, NotificationRepository, AccountRepository, NotificationGateway]
})
export class EventModule {}
