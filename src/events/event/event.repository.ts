import { HttpException, HttpStatus } from "@nestjs/common";
import {Brackets, DeleteResult, EntityRepository, getCustomRepository, ILike, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { FilterDto } from "src/_common/filter.dto";
import { AccountEntity } from "src/account/entities/account.entity";
import { EventEntity } from "./entities/event.entity";
import { CreateEventDto } from "./dto/create-event.dto";
import {validUrl} from '../../_utility/validurl.util';
import { EventRO } from "./interfaces/event.interface";
import { UpdateEventDto } from "./dto/update-event.dto";
import { EventRegistrationDto } from "./dto/event-registration.dto";
import { EventUsersRepository } from "../eventusers/eventusers.repository";
import { isNotValidDate } from "src/_utility/date-validator.util";
import { isNotValidTime } from "src/_utility/time-validator.util";


@EntityRepository(EventEntity)
export class EventRepository extends Repository<EventEntity> {


    async saveEvent(filename: string, payload: CreateEventDto, user: AccountEntity) : Promise<string> {

        const isEventName = await this.findOne({where: {name: ILike(`%${payload.name}%`)}});
        if(isEventName) {
            throw new HttpException( `Event with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        if(new Date(payload.endDate).setHours(0,0,0,0) < new Date(payload.startDate).setHours(0,0,0,0)) {
            throw new HttpException(`Start date of event cannot be greater than End date`, HttpStatus.BAD_REQUEST,);
        }

        if(isNotValidDate(payload.startDate)) {
            throw new HttpException( `Event Start Date cannot be less than current date`, HttpStatus.BAD_REQUEST);
        }
    
        if (isNotValidTime(payload.startTime, payload.startDate)) {
            throw new HttpException( `Event Start Time cannot be in the past.`, HttpStatus.BAD_REQUEST);
        } 

        if(payload.numberOfParticipants <= 0) {
            throw new HttpException( `Number of participants must be greater than zero.`, HttpStatus.BAD_REQUEST);
        }

        if(payload.online) {
            if(!payload.url) {
                throw new HttpException( `Please provide the url to the event.`, HttpStatus.BAD_REQUEST);
            }

            if(!validUrl(payload.url)) {
                throw new HttpException(`The event url ${payload.url} is not valid`, HttpStatus.BAD_REQUEST)
            }
        }

        if(payload.requireUniqueAccessCode) {
            
            if(!payload.accessCode) {
                throw new HttpException( `Please provide the access code to the event.`, HttpStatus.BAD_REQUEST);
            }

            const isAccessCodeExist = await this.findOne({where: {accessCode: ILike(`%${payload.accessCode}%`)}});
            if(isAccessCodeExist) {
                throw new HttpException( `Event with ${payload.accessCode} already exist`, HttpStatus.BAD_REQUEST);
            }
        }

        const newEvent = plainToClass(EventEntity, payload);

        newEvent.accountId = user.id;
        newEvent.createdBy = user.createdBy;
        
        if(filename) {
            newEvent.coverImage = filename;
        }
        

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

    async getAllEvents({search, page}: FilterDto): Promise<EventRO[]> {
    
        if(search) {

           const events =  await this.createQueryBuilder("event")
                    .innerJoinAndSelect("event.eventUsers", "eventUsers")
                    .where(new Brackets(qb => {
                        qb.where("event.name ILike :name", { name: `%${search}%` })
                        .orWhere("event.accessCode ILike :accessCode", { accessCode: `%${search}%` })
                    }))
                    .andWhere("event.published = true")
                    .orderBy("event.createdAt", "DESC")
                    .skip(15 * (page ? page - 1 : 0))
                    .take(15)
                    .getMany();

            return events;
        }

        return await this.find({relations: ['eventUsers'], order: { createdAt: 'DESC' }, take: 15, skip: 15 * (page - 1)});
    }

    
    async findMyEvents({search, page}: FilterDto, user: AccountEntity): Promise<EventRO[]> {
        
        if(!user.id) {
            throw new HttpException( `User Id is required.`, HttpStatus.BAD_REQUEST);
        }
        
        if(search) {

           const events =  await this.createQueryBuilder("event")
                    .innerJoinAndSelect("event.eventUsers", "eventUsers")
                    .where("event.accountId = :accountId", { accountId: user.id })
                    .andWhere(new Brackets(qb => {
                        qb.where("event.name ILike :name", { name: `%${search}%` })
                        .orWhere("event.accessCode ILike :accessCode", { accessCode: `%${search}%` })
                    }))
                    .orderBy("event.createdAt", "DESC")
                    .skip(15 * (page ? page - 1 : 0))
                    .take(15)
                    .getMany();

            return events;
        }

        return await this.find({where: {accountId: user.id}, relations: ['eventUsers'], order: { createdAt: 'DESC' }, take: 15, skip: 15 * (page - 1)});
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

    async updateEvent(id: string, filename: string, payload: UpdateEventDto, user: AccountEntity) : Promise<string> {
        const event = await this.findOne(id);
        if (event ) {

            if( event.name != payload.name) { 
                const isEventName = await this.findOne({where: {name: ILike(`%${payload.name}%`)}});
                if(isEventName) {
                    throw new HttpException( `Event with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
                }
            }

            if(new Date(payload.endDate).setHours(0,0,0,0) < new Date(payload.startDate).setHours(0,0,0,0)) {
                throw new HttpException(`Start date of event cannot be greater than End date`, HttpStatus.BAD_REQUEST,);
            }
    
            if(isNotValidDate(payload.startDate)) {
                throw new HttpException( `Event Start Date cannot be less than current date`, HttpStatus.BAD_REQUEST);
            }
        
            if (isNotValidTime(payload.startTime, payload.startDate)) {
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
    
            if(payload.requireUniqueAccessCode) {
                if(!payload.accessCode) {
                    throw new HttpException( `Please provide the access code to the event.`, HttpStatus.BAD_REQUEST);
                }
                
                if( event.accessCode != payload.accessCode) { 
                    const isAccessCodeExist = await this.findOne({where: {accessCode: ILike(`%${payload.accessCode}%`)}});
                    if(isAccessCodeExist) {
                        throw new HttpException( `Event with ${payload.accessCode} already exist`, HttpStatus.BAD_REQUEST);
                    }
                }
            }
    

            event.updatedAt = new Date();
            event.updatedBy = user.updatedBy || user.createdBy;

            if(filename) {
                event.coverImage = filename;
            }
            

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

    async publishEvent(id: string, user: AccountEntity): Promise<string> {
        const ev = await this.findOne(id);
        
        if(!ev) {
            throw new HttpException(`The event with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);
        }

        // if(ev.accountId != user.id) {
        //     throw new HttpException(`You can only publish an event created by you`, HttpStatus.NOT_FOUND);
        // }

        ev.published = true;
        ev.publishedOn = new Date();
        
        try {
            await this.save(ev);
            return "Event successfully Published";
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async addEventRegistration(payload: EventRegistrationDto, user: AccountEntity): Promise<string> {
        
        const today = new Date();

        const eventUsersRepository = getCustomRepository(EventUsersRepository);

        const eventRegistringFor = await this.findOne({where: {id: payload.eventId}});
        
        if(!eventRegistringFor) {
            throw new HttpException(`The event you are trying to register for is invalid or does not exist`, HttpStatus.BAD_REQUEST);
        }

        if(today.getDate() > new Date(eventRegistringFor.startDate).getDate()) {
            throw new HttpException(`This event does not accept registration anymore`, HttpStatus.BAD_REQUEST);
        }

        if(!eventRegistringFor.requireRegistration) {
            throw new HttpException(`Invalid request, you cannot register for this event at this time.`, HttpStatus.BAD_REQUEST);
        }

        if(!eventRegistringFor.published) {
            throw new HttpException(`This event has not been published yet`, HttpStatus.BAD_REQUEST);
        }

        if(eventRegistringFor.cost > 0) {
            if(!payload.paid) {
                throw new HttpException(`Sorry, This a paid event, make sure you complete your payment before proceeding`, HttpStatus.BAD_REQUEST);
            }
        }

        // if(eventRegistringFor.requireUniqueAccessCode) {
        //     if(!payload.accessCode) {
        //         throw new HttpException(`Please provide the access code for this event`, HttpStatus.BAD_REQUEST);
        //     }
        // }

        const userRegisteredForSameEvent = await eventUsersRepository.findByEmailAndEventId(payload.eventId, payload.email);
        if(userRegisteredForSameEvent) {
            throw new HttpException(`The email ${payload.email} has already been used to register for this event.`, HttpStatus.BAD_REQUEST);
        }

        const allUsersInEvent = await eventUsersRepository.getAllEventUsersByEventId(payload.eventId);
        if(allUsersInEvent.length >= eventRegistringFor.numberOfParticipants) {
            throw new HttpException(`Sorry, The maximum number of participants has been reached for this event`, HttpStatus.BAD_REQUEST);
        }

        return await eventUsersRepository.createEventUsers(payload, user);

    }

}