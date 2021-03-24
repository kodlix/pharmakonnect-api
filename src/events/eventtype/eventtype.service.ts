import { Injectable } from '@nestjs/common';
import { CreateEventtypeDto } from './dto/create-eventtype.dto';
import { UpdateEventtypeDto } from './dto/update-eventtype.dto';

@Injectable()
export class EventtypeService {
  create(createEventtypeDto: CreateEventtypeDto) {
    return 'This action adds a new eventtype';
  }

  findAll() {
    return `This action returns all eventtype`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventtype`;
  }

  update(id: number, updateEventtypeDto: UpdateEventtypeDto) {
    return `This action updates a #${id} eventtype`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventtype`;
  }
}
