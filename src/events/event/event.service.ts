import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AccountRepository } from 'src/account/account.repository';
import { AccountEntity } from 'src/account/entities/account.entity';
import { NotificationType } from 'src/enum/enum';
import { NotificationGateway } from 'src/gateway/notification.gateway';
import { NodeMailerService } from 'src/mailer/node-mailer.service';
import { NotificationRO } from 'src/notifications/notification/interface/notification.interface';
import { NotificationRepository } from 'src/notifications/notification/notification.repository';
import { NotificationTypeRepository } from 'src/notifications/notificationtype/notificationtype.repository';
import { FilterDto } from 'src/_common/filter.dto';
import { Connection, DeleteResult } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { EventRegistrationDto } from './dto/event-registration.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventRepository } from './event.repository';
import { EventRO } from './interfaces/event.interface';


@Injectable()
export class EventService {

  private  acctRepo: AccountRepository;
  private  notTypeRepo: NotificationTypeRepository;
  private  notiRepo: NotificationRepository

  constructor(private readonly mailService: NodeMailerService, private readonly eventRepo: EventRepository, connection: Connection, private readonly notiGateway: NotificationGateway) {
      this.acctRepo = connection.getCustomRepository(AccountRepository);
      this.notTypeRepo = connection.getCustomRepository(NotificationTypeRepository);
      this.notiRepo = connection.getCustomRepository(NotificationRepository);
  }
  
 

  async create(request: CreateEventDto, user: AccountEntity) : Promise<string> {
    if(request.cost) {
      request.cost = parseInt(request.cost);
    } else {
      request.cost = 0;
    }
    if(request.numberOfParticipants) {
      request.numberOfParticipants = parseInt(request.numberOfParticipants);
    }

    request.requireRegistration = this.stringToBoolean(request.requireRegistration);
    request.requireUniqueAccessCode = this.stringToBoolean(request.requireUniqueAccessCode);

    request.online = this.stringToBoolean(request.online);
    request.free = this.stringToBoolean(request.free);

    return await this.eventRepo.saveEvent(request.coverImage, request, user);
  }

  async findAllPublishEvents(queryParam: FilterDto): Promise<EventRO[]> {
    return await this.eventRepo.findAllPublishEvents(queryParam);
  }

  async GetAllEvents(queryParam: FilterDto): Promise<EventRO[]> {
    return await this.eventRepo.GetAllEvents(queryParam);
  }


  async findMyEvents(queryParam: FilterDto, user: AccountEntity): Promise<EventRO[]> {
    return await this.eventRepo.findMyEvents(queryParam, user);
  }

  async findOne(id: string) : Promise<EventRO>{
    return await this.eventRepo.findEventById(id);
  }

  async update(id: string, updateEventDto: UpdateEventDto, user: AccountEntity) : Promise<string> {
    if(updateEventDto.cost) {
      updateEventDto.cost = parseInt(updateEventDto.cost);
    } else {
      updateEventDto.cost = 0;
    }
    if(updateEventDto.numberOfParticipants) {
      updateEventDto.numberOfParticipants = parseInt(updateEventDto.numberOfParticipants);
    }

    updateEventDto.requireRegistration = this.stringToBoolean(updateEventDto.requireRegistration);
    updateEventDto.requireUniqueAccessCode = this.stringToBoolean(updateEventDto.requireUniqueAccessCode);

    updateEventDto.online = this.stringToBoolean(updateEventDto.online);
    updateEventDto.free = this.stringToBoolean(updateEventDto.free);
    return await this.eventRepo.updateEvent(id, updateEventDto.coverImage, updateEventDto, user);
  }

  async publishEvent(id: string, user: AccountEntity) : Promise<string> {
            const result =  await this.eventRepo.publishEvent(id, user);
            const notType = await this.notTypeRepo.findOne({where: {name: NotificationType.EVENT}});
            
            const res = await this.acctRepo.findByEmail("admin@netopng.com");

            const ev = await this.eventRepo.findOne(id);
            
            const noti: NotificationRO = {
                message: `Hi ${ev.createdBy}, your event has been published`,
                senderId: res.id,
                recieverId: ev.accountId,
                entityId: ev.id,
                isGeneral: false,
                createdAt: new Date(),
                accountId: ev.accountId,
                seen: false,
                senderImageUrl: res.profileImage ? res.profileImage : null,
                notificationType: notType,
                createdBy: "admin@netopng.com"
            }

            try {
              await this.notiRepo.save(noti);
              this.notiGateway.sendToUser(noti, ev.accountId);
            } catch (error) {
              Logger.log(error);
              return result;
            }
            return result;
  }

  async rejectEvent(id: string, {rejectionMessage}, user: AccountEntity) : Promise<string> {
            const result = await this.eventRepo.rejectEvent(id, rejectionMessage, user);

            const notType = await this.notTypeRepo.findOne({where: {name: NotificationType.EVENT}});
            
            const res = await this.acctRepo.findByEmail("admin@netopng.com");

            const ev = await this.eventRepo.findOne(id);
            
            const noti: NotificationRO = {
                message: `Hi ${ev.createdBy}, your event has been rejected: Reason: ${ev.rejectionMessage}`,
                senderId: res.id,
                recieverId: ev.accountId,
                entityId: ev.id,
                isGeneral: false,
                createdAt: new Date(),
                accountId: ev.accountId,
                seen: false,
                senderImageUrl: res.profileImage ? res.profileImage : null,
                notificationType: notType,
                createdBy: "admin@netopng.com"
            }

            try {
              await this.notiRepo.save(noti);
              this.notiGateway.sendToUser(noti, ev.accountId);
            } catch (error) {
              Logger.log(error);
              return result;
            }

            return result;
  }

  async addEventRegistration(payload: EventRegistrationDto, user: AccountEntity): Promise<string> {
    
    try {
       await this.eventRepo.addEventRegistration(payload, user);
      const event = await this.eventRepo.findOne({where: {id: payload.eventId}});
      
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
            //         organizerphoneNumber: event.organizerPhoneNumber,
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

            return "Successfully registered for the event, Kindly check you email for event details"

    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
    
  }

  async remove(id: string) : Promise<DeleteResult>{
    return await this.eventRepo.deleteEvent(id);
  }

  stringToBoolean(val: any){
    if(!val) {
      throw new HttpException( `Please make sure all required fields are set.`, HttpStatus.BAD_REQUEST);
    }
    switch(val.toLowerCase().trim()){
        case 'true': return true;
        case 'false':return false;
        default: return Boolean(val);
    }
}
}
