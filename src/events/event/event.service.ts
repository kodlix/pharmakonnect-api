import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { FilterDto } from 'src/_common/filter.dto';
import { DeleteResult } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { EventRegistrationDto } from './dto/event-registration.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventRepository } from './event.repository';
import { EventRO } from './interfaces/event.interface';


@Injectable()
export class EventService {
  
  constructor(private readonly eventRepo: EventRepository) {}

  async create(filename, request: CreateEventDto, user: AccountEntity) : Promise<string> {
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

    return await this.eventRepo.saveEvent(filename, request, user);
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

  async update(id: string, filename, updateEventDto: UpdateEventDto, user: AccountEntity) : Promise<string> {
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
    return await this.eventRepo.updateEvent(id, filename, updateEventDto, user);
  }

  async publishEvent(id: string, user: AccountEntity) : Promise<string> {
    return await this.eventRepo.publishEvent(id, user);
  }

  async rejectEvent(id: string, {rejectionMessage}, user: AccountEntity) : Promise<string> {
    return await this.eventRepo.rejectEvent(id, rejectionMessage, user);
  }

  async addEventRegistration(payload: EventRegistrationDto, user: AccountEntity): Promise<string> {
    return await this.eventRepo.addEventRegistration(payload, user);
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
