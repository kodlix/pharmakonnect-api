import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { CreateNotificationtypeDto } from './dto/create-notificationtype.dto';
import { UpdateNotificationtypeDto } from './dto/update-notificationtype.dto';
import { NotificationTypeRepository } from './notificationtype.repository';

@Injectable()
export class NotificationtypeService {

  constructor(private readonly notificationTypeRepo: NotificationTypeRepository) {}

  async create(payload: CreateNotificationtypeDto, user?: AccountEntity): Promise<string> {
    return await this.notificationTypeRepo.saveNotificationType(payload, user);
  }

  async findAll() {
    return await this.notificationTypeRepo.find();
  }

  async findOne(id: string) {
    return await this.notificationTypeRepo.findNotificationTypeById(id);
  }

  async update(id: string, payload: UpdateNotificationtypeDto, user: AccountEntity) {
    return await this.notificationTypeRepo.updateNotificationType(id, payload, user);
  }

  async remove(id: string) {
    return await this.notificationTypeRepo.deleteNotificationType(id);
  }
}
