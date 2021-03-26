import { HttpException, HttpStatus } from "@nestjs/common";
import { Brackets, DeleteResult, EntityRepository, Like, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { FilterDto } from "src/_common/filter.dto";
import { AccountEntity } from "src/account/entities/account.entity";
import { EventUsersEntity } from "./entities/eventusers.entity";
import { EventRegistrationDto } from "../event/dto/event-registration.dto";
import { EventUsersRO } from "./interfaces/eventusers.interface";
import { UpdateEventUserRegistrationDto } from "./dto/update-eventuser.dto";


@EntityRepository(EventUsersEntity)
export class EventUsersRepository extends Repository<EventUsersEntity> {



    async createEventUsers(payload: EventRegistrationDto, user: AccountEntity): Promise<string> {
        
        const newEventUsers = plainToClass(EventUsersEntity, payload);
        newEventUsers.createdBy = user.createdBy;
                
        const errors = await validate(newEventUsers);
        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.save(newEventUsers);
             return "Successfully registered for the event.";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findByEmailAndEventId(eventId, email): Promise<boolean> {
        const exist = await this.findOne({where: {eventId: eventId, email: email}});
        if(exist) return true;
        return false;
    }

    async getAllEventUsers({search, page}: FilterDto): Promise<EventUsersRO[]> {
        
        if(search) {

           const eventsUsers =  await this.createQueryBuilder("evu")
                    .innerJoinAndSelect("evu.event", "event")
                    .where(new Brackets(qb => {
                        qb.where("evu.email ILike :email", { email: `%${search}%` })
                        .orWhere("evu.accessCode ILike :accessCode", { accessCode: `%${search}%` })
                    }))
                    .orderBy("evu.createdAt", "ASC")
                    .skip(25 * (page ? page - 1 : 0))
                    .take(25)
                    .getMany();

            return eventsUsers;
        }

        return await this.find({order: { createdAt: 'ASC' }, relations: ['event'], take: 25, skip: 25 * (page - 1)});
    }

    async findMeFromEventUsers({search, page}: FilterDto, user: AccountEntity): Promise<EventUsersRO[]> {
        
        if(!user.id) {
            throw new HttpException( `User Id is required.`, HttpStatus.BAD_REQUEST);
        }
        

        if(search) {

           const eventsUsers =  await this.createQueryBuilder("evu")
                    .innerJoinAndSelect("evu.event", "event")
                    .where("event.accountId = :accountId", { accountId: user.id })
                    .andWhere(new Brackets(qb => {
                        qb.where("evu.email ILike :email", { email: `%${search}%` })
                        .orWhere("evu.accessCode ILike :accessCode", { accessCode: `%${search}%` })
                    }))
                    .orderBy("evu.createdAt", "ASC")
                    .skip(25 * (page ? page - 1 : 0))
                    .take(25)
                    .getMany();

            return eventsUsers;
        }

        return await this.find({where: {accountId: user.id}, order: { createdAt: 'ASC' }, relations: ['event'], take: 25, skip: 25 * (page - 1)});
    }


    async findEventUsersById(id: string): Promise<EventUsersRO> {

        const eventUser = await this.findOne(id);
        if(eventUser) {
            return eventUser;
        }
        throw new HttpException(`The event user with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }

    async getAllEventUsersByEventId(eventId: string): Promise<EventUsersRO[]> {
        return await this.find({where: {eventId: eventId}})
    }
    
    async deleteEventUser(id: string): Promise<DeleteResult> {

        const eventUser = await this.findOne(id);
        if(eventUser) {
            return await this.delete({ id: eventUser.id });
        }

        throw new HttpException(`The event user with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateEventUser(id: string, payload: UpdateEventUserRegistrationDto, user: AccountEntity) : Promise<string> {
        const eventUser = await this.findOne(id);
        if (eventUser ) {
            
            if( eventUser.email != payload.email) {
                
                const userRegisteredForSameEvent = await this.findByEmailAndEventId(payload.eventId, payload.email);
                if(userRegisteredForSameEvent) {
                    throw new HttpException(`The email ${payload.email} has already been used to register for this event.`, HttpStatus.BAD_REQUEST)
                }
            }

            eventUser.updatedAt = new Date();
            eventUser.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(eventUser, payload);

            try {
                 await this.save(updated);
                 return "Event user successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The event user with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);
    }

}