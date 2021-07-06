import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { NotificationtypeModule } from './notificationtype/notificationtype.module';


@Module({
  imports: [NotificationModule, NotificationtypeModule]
})
export class NotificationsModule {}