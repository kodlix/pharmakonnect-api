import { Module } from '@nestjs/common';
import { NotificationtypeService } from './notificationtype.service';
import { NotificationtypeController } from './notificationtype.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { NotificationTypeRepository } from './notificationtype.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationTypeRepository]), AccountModule
  ],
  controllers: [NotificationtypeController],
  providers: [NotificationtypeService],
  exports: [NotificationtypeService]
})
export class NotificationtypeModule {}
