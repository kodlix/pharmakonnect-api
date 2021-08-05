import { HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Brackets, DeleteResult, EntityRepository, Like, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { FilterDto } from "src/_common/filter.dto";
import { AccountEntity } from "src/account/entities/account.entity";
import { EventUsersEntity } from "./entities/eventusers.entity";
import { EventRegistrationDto } from "../event/dto/event-registration.dto";
import { EventUsersRO } from "./interfaces/eventusers.interface";
import { UpdateEventUserRegistrationDto } from "./dto/update-eventuser.dto";
import { EventEntity } from "../event/entities/event.entity";
import * as SendGrid from "@sendgrid/mail";
import { NodeMailerService } from "src/mailer/node-mailer.service";

@EntityRepository(EventUsersEntity)
export class EventUsersRepository extends Repository<EventUsersEntity> {

    
    constructor(private readonly mailService: NodeMailerService) {
        super();
        //SendGrid.setApiKey("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")
    }

    async createEventUsers(payload: EventRegistrationDto, user: AccountEntity, event: EventEntity): Promise<string> {
        
        const newEventUsers = plainToClass(EventUsersEntity, payload);
        newEventUsers.createdBy = user.createdBy;
                
        const errors = await validate(newEventUsers);
        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.save(newEventUsers);
             (event.startTime as any) = (event.startTime as any).split(':')[0] >= 12 ? `${event.startTime} PM` : `${event.startTime} AM`;
             (event.endTime as any) = (event.endTime as any).split(':')[0] >= 12 ? `${event.endTime} PM` : `${event.endTime} AM`;

            //  const msg = {
            //     to: payload.email,
            //     from: "Kaapsul <zack.aminu@netopconsult.com>",
            //     templateId: 'd-3f12473cbde44380be0c9a66f34a8784',
            //     dynamicTemplateData: {
            //         name: payload.name,
            //         eventName: event.name,
            //         Sdate: event.startDate,
            //         Edate: event.endDate,
            //         startTime: event.startTime,
            //         endTime: event.endTime,
            //         venue: event.venue,
            //         organizerName: event.organizerName,
            //         organizerPhoneNo: event.organizerPhoneNumber,
            //         accessCode: event.requireUniqueAccessCode ? payload.accessCode : 'NIL',
            //         url: event.online ? event.url : 'NIL'
            //     }
            // }

            
            
                const subject = `Your ${event.name} registration details is here`;
                const html = `<p> Dear ${payload.name}, </p> <br>
                        <p> Thanks for registering for the event ${event.name}, please find below the details of the event.</p> <br>
                        <p> Event Name: <strong> ${event.name} </strong> </p> <br>
                        <p> Start Date: <strong> ${event.startDate} </strong> </p> <br>
                        <p> End Date: <strong> ${event.endDate} </strong> </p> <br>
                        <p> Start Time: <strong> ${event.startTime} </strong> </p> <br>
                        <p> End Time: <strong> ${event.endTime} </strong> </p> <br>
                        <p> Venue: <strong> ${event.venue} </strong> </p> <br>
                        <p> Organizer Name: <strong> ${event.organizerName} </strong> </p> <br>
                        <p> Organizer Phone No: <strong> ${event.organizerPhoneNumber} </strong></p> <br>
                        <p> Access Code: <strong> ${event.requireUniqueAccessCode ? payload.accessCode : 'NIL'} </strong> </p> <br>
                        <p> Url: <strong> ${event.url ? event.url : 'NIL'} </strong> </p>
                        `
            
            await this.mailService.sendHtmlMailAsync(payload.email, subject, html);

             //await SendGrid.send(msg);
             return "Successfully registered for the event.";
        } catch(error)  {
            Logger.log("Reg + mail", error);
            return "Successfully registered for the event.";
            //throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
                    .leftJoinAndSelect("evu.event", "event")
                    .where(new Brackets(qb => {
                        qb.where("evu.email ILike :email", { email: `%${search}%` })
                        .orWhere("evu.accessCode ILike :accessCode", { accessCode: `%${search}%` })
                    }))
                    .orderBy("evu.createdAt", "DESC")
                    .skip(15 * (page ? page - 1 : 0))
                    .take(15)
                    .getMany();

            return eventsUsers;
        }

        return await this.find({order: { createdAt: 'ASC' }, relations: ['event'], take: 15, skip: 15 * (page - 1)});
    }

    async findMeFromEventUsers({search, page}: FilterDto, user: AccountEntity): Promise<EventUsersRO[]> {
        
        if(!user.id) {
            throw new HttpException( `User Id is required.`, HttpStatus.BAD_REQUEST);
        }
        

        if(search) {

           const eventsUsers =  await this.createQueryBuilder("evu")
                    .leftJoinAndSelect("evu.event", "event")
                    .where("event.accountId = :accountId", { accountId: user.id })
                    .andWhere(new Brackets(qb => {
                        qb.where("evu.email ILike :email", { email: `%${search}%` })
                        .orWhere("evu.accessCode ILike :accessCode", { accessCode: `%${search}%` })
                    }))
                    .orderBy("evu.createdAt", "DESC")
                    .skip(15 * (page ? page - 1 : 0))
                    .take(15)
                    .getMany();

            return eventsUsers;
        }

        return await this.find({where: {accountId: user.id}, order: { createdAt: 'DESC' }, relations: ['event'], take: 15, skip: 15 * (page - 1)});
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