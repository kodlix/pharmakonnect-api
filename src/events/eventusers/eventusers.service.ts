import { Injectable } from '@nestjs/common';
import { CreateEventuserDto } from './dto/create-eventuser.dto';
import { UpdateEventuserDto } from './dto/update-eventuser.dto';

@Injectable()
export class EventusersService {
  create(createEventuserDto: CreateEventuserDto) {
    return 'This action adds a new eventuser';
  }

  findAll() {
    return `This action returns all eventusers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventuser`;
  }

  update(id: number, updateEventuserDto: UpdateEventuserDto) {
    return `This action updates a #${id} eventuser`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventuser`;
  }
}
