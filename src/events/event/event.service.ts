import { Injectable } from '@nestjs/common';
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
      return await this.eventRepo.saveEvent(filename, request, user);
  }

  async findAll(queryParam: FilterDto, user: AccountEntity): Promise<EventRO[]> {
    return await this.eventRepo.getAllEvents(queryParam, user);
  }

  async findOne(id: string) : Promise<EventRO>{
    return await this.eventRepo.findEventById(id);
  }

  async update(id: string, updateEventDto: UpdateEventDto, user: AccountEntity) : Promise<string> {
    return await this.eventRepo.updateEvent(id, updateEventDto, user);
  }

  async publishEvent(id: string) : Promise<string> {
    return await this.eventRepo.publishEvent(id);
  }

  async addEventRegistration(payload: EventRegistrationDto, user: AccountEntity): Promise<string> {
    return await this.eventRepo.addEventRegistration(payload, user);
  }

  async remove(id: string) : Promise<DeleteResult>{
    return await this.eventRepo.deleteEvent(id);
  }
}
