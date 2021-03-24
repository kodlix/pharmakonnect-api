import { HttpException, HttpStatus } from "@nestjs/common";
import {Brackets, DeleteResult, EntityRepository, Like, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { FilterDto } from "src/_common/filter.dto";
import { AccountEntity } from "src/account/entities/account.entity";
import { EventEntity } from "./entities/event.entity";
import { CreateEventDto } from "./dto/create-event.dto";
import {validUrl} from '../../_utility/validurl.util';
import { EventRO } from "./interfaces/event.interface";
import { UpdateEventDto } from "./dto/update-event.dto";


@EntityRepository(EventEntity)
export class EventRepository extends Repository<EventEntity> {

    async saveEvent(payload: CreateEventDto, user: AccountEntity) : Promise<string> {

        const start = new Date();
        const end = new Date(start);
        end.setDate(start.getDate() + 1);

        const eventDateTimeExist = await this.createQueryBuilder('ev')
                .select('id')
                .where(`ev.startDate BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'`)
                .andWhere("ev.startTime::time  = localtime ")
                .getOne();
        
        if(eventDateTimeExist) {
            throw new HttpException( `There is an event scheduled for the date ${payload.startDate} at the time ${payload.startTime}`, HttpStatus.BAD_REQUEST);
        }
        
        const today = new Date();

        if(today > new Date(payload.startDate)) {
            throw new HttpException( `Event Start Date ${payload.startDate} cannot be less than current date`, HttpStatus.BAD_REQUEST);
        }

        const todayTime = `${today.getHours()}.${today.getMinutes()}`;

        const splitedStartTime = payload.startTime.toString().split(":");
        const startTime = `${splitedStartTime[0]}.${splitedStartTime[1]}`;
         
        if (todayTime > startTime) {
            throw new HttpException( `Event Start Time cannot be in the past.`, HttpStatus.BAD_REQUEST);
        } 

        if(payload.online) {
            if(!payload.url) {
                throw new HttpException( `Please provide the url to the event.`, HttpStatus.BAD_REQUEST);
            }

            if(!validUrl(payload.url)) {
                throw new HttpException(`The event url ${payload.url} is not valid`, HttpStatus.BAD_REQUEST)
            }
        }

        if(payload.requireAccessCode || payload.requireUniqueAccessCode) {
            if(!payload.accessCode) {
                throw new HttpException( `Please provide the access code to the event.`, HttpStatus.BAD_REQUEST);
            }
        }

        const newEvent = plainToClass(EventEntity, payload);

        newEvent.accountId = user.id;
        newEvent.createdBy = user.createdBy;

        const errors = await validate(newEvent);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.save(newEvent);
             return "Event successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAllEvents({search, page}: FilterDto, user: AccountEntity): Promise<EventRO[]> {
        
        if(!user.id) {
            throw new HttpException( `User Id is required.`, HttpStatus.BAD_REQUEST);
        }
        
        if(search) {

           const events =  await this.createQueryBuilder("ev")
                    .where("meet.accountId = :accountId", { accountId: user.id })
                    .andWhere(new Brackets(qb => {
                        qb.where("meet.name ILike :name", { name: `%${search}%` })
                        .orWhere("meet.accessCode ILike :accessCode", { accessCode: `%${search}%` })
                    }))
                    .orderBy("ev.createdAt", "ASC")
                    .take(25)
                    .skip(25)
                    .getMany();

            return events;
        }

        return await this.find({where: {accountId: user.id}, order: { createdAt: 'ASC' }, take: 25, skip: 25 * (page - 1)});
    }

    async findEventById(id: string): Promise<EventRO> {

        const event = await this.findOne(id);
        if(event) {
            return event;
        }
        throw new HttpException(`The event with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async deleteEvent(id: string): Promise<DeleteResult> {

        const event = await this.findOne(id);
        if(event) {
            if(event.published) {
                throw new HttpException(`Event has been published and therefore cannot be deleted`, HttpStatus.BAD_REQUEST);
            }
            return await this.delete({ id: event.id });
        }

        throw new HttpException(`The event with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateEvent(id: string, payload: UpdateEventDto, user: AccountEntity) : Promise<string> {
        const event = await this.findOne(id);
        if (event ) {

            const today = new Date();

            if(today > new Date(payload.startDate)) {
                throw new HttpException( `Event Start Date ${payload.startDate} cannot be less than current date`, HttpStatus.BAD_REQUEST);
            }
    
            const todayTime = `${today.getHours()}.${today.getMinutes()}`;

            const splitedStartTime = payload.startTime.toString().split(":");
            const startTime = `${splitedStartTime[0]}.${splitedStartTime[1]}`;
            
            if (todayTime > startTime) {
                throw new HttpException( `Event Start Time cannot be in the past.`, HttpStatus.BAD_REQUEST);
            } 

            event.updatedAt = new Date();
            event.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(event, payload);

            try {
                 await this.save(updated);
                 return "Event successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The event with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);
    }

    async publishEvent(id: string): Promise<string> {
        const ev = await this.findOne(id);
        if(!ev) {
            throw new HttpException(`The event with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);
        }

        ev.published = true;
        ev.publishedOn = new Date();
        
        try {
            await this.save(ev);
            return "Event successfully Published";
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}