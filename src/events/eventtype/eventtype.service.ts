import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { CreateEventtypeDto } from './dto/create-eventtype.dto';
import { UpdateEventtypeDto } from './dto/update-eventtype.dto';
import { EventTypeRepository } from './eventtype.repository';

@Injectable()
export class EventtypeService {

  constructor(private readonly eventTypeRepo: EventTypeRepository) {

  }

  async create(createEventtypeDto: CreateEventtypeDto, user: AccountEntity): Promise<string> {
    return await this.eventTypeRepo.saveEventType(createEventtypeDto, user);
  }

  async findAll() {
    return await this.eventTypeRepo.getAllEventTypes();
  }

  async findOne(id: string) {
    return await this.eventTypeRepo.findEventTypeById(id);
  }

  async update(id: string, updateEventtypeDto: UpdateEventtypeDto, user: AccountEntity) {
    return await this.eventTypeRepo.updateEventType(id, updateEventtypeDto, user);
  }

  async remove(id: string) {
    return await this.eventTypeRepo.deleteEventType(id);
  }
}
