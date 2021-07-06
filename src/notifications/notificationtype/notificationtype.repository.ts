import { HttpException, HttpStatus } from "@nestjs/common";
import { DeleteResult, EntityRepository, ILike, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { AccountEntity } from "src/account/entities/account.entity";
import { NotificationTypeEntity } from "./entities/notificationtype.entity";
import { CreateNotificationtypeDto } from "./dto/create-notificationtype.dto";
import { UpdateNotificationtypeDto } from "./dto/update-notificationtype.dto";
import { NotificationTypeRO } from "./interfaces/notificationtype.interface";


@EntityRepository(NotificationTypeEntity)
export class NotificationTypeRepository extends Repository<NotificationTypeEntity> {

    async saveNotificationType(payload: CreateNotificationtypeDto, user: AccountEntity) : Promise<string> {

        const isnotificationTypeNameExist = await this.findOne({where: {name: ILike(`%${payload.name}%`)}});
        if(isnotificationTypeNameExist) {
            throw new HttpException( `Notification type with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newNotType = plainToClass(NotificationTypeEntity, payload);

        if(user) {
            newNotType.createdBy = user.createdBy;
        } else {
            newNotType.createdBy = "Administrator";
        }
        
        const errors = await validate(newNotType);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.save(newNotType);
             return "Notification Type successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAllNotificationTypes(): Promise<NotificationTypeRO[]> {
        
        return await this.find();
    }

    async findNotificationTypeById(id: string): Promise<NotificationTypeRO> {

        const notType = await this.findOne(id);
        if(notType) {
            return notType;
        }
        throw new HttpException(`The notification type with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async deleteNotificationType(id: string): Promise<DeleteResult> {

        const notType = await this.findOne(id);
        if(notType) {
            return await this.delete({ id: notType.id });
        }

        throw new HttpException(`The notification type with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateNotificationType(id: string, payload: UpdateNotificationtypeDto, user: AccountEntity) : Promise<string> {
        const notType = await this.findOne(id);
        if (notType ) {

            if( notType.name != payload.name) {
                
                const nameExist = await this.findOne({where: {name: ILike(`%${payload.name}%`)}});
                if(nameExist){
                    throw new HttpException( `Notification type with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            notType.updatedAt = new Date();
            notType.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(notType, payload);

            try {
                 await this.save(updated);
                 return "Notification Type successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The notification type with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);
    }

}