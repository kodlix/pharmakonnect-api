import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { FilterDto } from 'src/_common/filter.dto';
import { DeleteResult } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventRepository } from './event.repository';
import { EventRO } from './interfaces/event.interface';


@Injectable()
export class EventService {
  
  constructor(private readonly eventRepo: EventRepository) {}

  async create(request: CreateEventDto, user: AccountEntity) : Promise<string> {
      return await this.eventRepo.saveEvent(request, user);
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

  async remove(id: string) : Promise<DeleteResult>{
    return await this.eventRepo.deleteEvent(id);
  }
}
