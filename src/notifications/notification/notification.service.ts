import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Brackets, DeleteResult } from 'typeorm';
import { NotificationRO } from './interface/notification.interface';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
 
  constructor(private readonly notificationRepo: NotificationRepository) {}


  async findAll() {
    return await this.notificationRepo.find({relations: ['notificationType'], order: {createdAt: 'DESC'}});
  }

  async findOne(id: string) {
    return await this.notificationRepo.findOne(id, {relations: ['notificationType']});
  }

  async findByAccount(accountId: string) {
    return await this.notificationRepo.find({where: {accountId, seen: false}, order: {createdAt: 'DESC'}, relations: ['notificationType']});
  }

  async findAllByAccount({accountId, page, search}) {
    page = parseInt(page);
    if(!accountId) throw new HttpException('Account id is required', HttpStatus.BAD_REQUEST);
    
    if(search) {

      const nots =  await this.notificationRepo.createQueryBuilder("not")
               .leftJoinAndSelect("not.notificationType", "notificationType")
               .where("not.accountId = :accountId", { accountId })
               .andWhere(new Brackets(qb => {
                   qb.where("not.message ILike :message", { message: `%${search}%` })
                   .orWhere("not.createdBy ILike :createdBy", { createdBy: `%${search}%` })
               }))
               .orderBy("not.createdAt", "DESC")
               .skip(10 * (page ? page - 1 : 0))
               .take(10)
               .getMany();

       return nots;
   }

    return await this.notificationRepo.find({where: {accountId}, order: { createdAt: 'DESC' }, take: 10, skip: 10 * (page - 1), relations: ['notificationType']});
  }

  async update(id: string) {
    const not = await this.notificationRepo.findOne(id, {relations: ['notificationType']});

    if(!not) {
      throw new HttpException('Notification does not exist', HttpStatus.NOT_FOUND);
    }


    try {
      not.seen = true;
      const res = await this.notificationRepo.save(not);
      
      return await this.notificationRepo.find({where: {accountId: res.accountId, seen: false}, order: {createdAt: 'DESC'}, relations: ['notificationType']})
    } catch (error) {
      Logger.log(error);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    const not = await this.notificationRepo.findOne(id, {relations: ['notificationType']});

    if(!not) {
      throw new HttpException('Notification does not exist', HttpStatus.NOT_FOUND);
    }

    return await this.notificationRepo.delete({id});
  }


}
