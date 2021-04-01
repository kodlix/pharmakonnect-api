import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { FilterDto } from 'src/_common/filter.dto';
import { DeleteResult } from 'typeorm';
import { UpdateEventUserRegistrationDto } from './dto/update-eventuser.dto';
import { EventUsersRepository } from './eventusers.repository';
import { EventUsersRO } from './interfaces/eventusers.interface';

@Injectable()
export class EventusersService {
 
  constructor(private readonly eventUsersRepo: EventUsersRepository) {

  }

  async findAll(queryParam: FilterDto): Promise<EventUsersRO[]> {
    return await this.eventUsersRepo.getAllEventUsers(queryParam);
  }

  async findMeFromEventUsers(queryParam: FilterDto, user: AccountEntity): Promise<EventUsersRO[]> {
    return await this.eventUsersRepo.findMeFromEventUsers(queryParam, user);
  }

  async findOne(id: string): Promise<EventUsersRO> {
    return await this.eventUsersRepo.findEventUsersById(id);
  }

  async update(id: string, req: UpdateEventUserRegistrationDto, user: AccountEntity): Promise<string> {
    return await this.eventUsersRepo.updateEventUser(id, req, user);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.eventUsersRepo.deleteEventUser(id);
  }
}
