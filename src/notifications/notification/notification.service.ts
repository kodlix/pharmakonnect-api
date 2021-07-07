import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
 
  constructor(private readonly notificationRepo: NotificationRepository) {}


  async findAll() {
    return await this.notificationRepo.find({relations: ['notificationType']});
  }

  async findOne(id: string) {
    return await this.notificationRepo.findOne(id, {relations: ['notificationType']});
  }

  async findByAccount(accountId: string) {
    return await this.notificationRepo.find({where: {accountId, seen: false}, relations: ['notificationType']});
  }

  async findAllByAccount(accountId: string) {
    return await this.notificationRepo.find({where: {accountId}, relations: ['notificationType']});
  }

  async update(id: string): Promise<string> {
    const not = await this.notificationRepo.findOne(id);

    if(!not) {
      throw new HttpException('Notification does not exist', HttpStatus.NOT_FOUND);
    }


    try {
      await this.notificationRepo.createQueryBuilder("t")
                              .update()
                              .set({seen: true})
                              .where({id: not.id})
                              .execute();

        return "Successfully updated"
    } catch (error) {
      Logger.log(error);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    const not = await this.notificationRepo.findOne(id);

    if(!not) {
      throw new HttpException('Notification does not exist', HttpStatus.NOT_FOUND);
    }

    return await this.notificationRepo.delete({id});
  }


}
