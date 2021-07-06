import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
 
  constructor(private readonly notificationRepo: NotificationRepository) {}


  async findAll() {
    return await this.notificationRepo.find();
  }

  async findOne(id: string) {
    return await this.notificationRepo.findOne(id);
  }

  async findByAccount(id: string) {
    return await this.notificationRepo.find({where: {accountId: id}});
  }


}
