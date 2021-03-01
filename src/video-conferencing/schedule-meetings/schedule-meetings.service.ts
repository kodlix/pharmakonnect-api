import { Injectable } from '@nestjs/common';
import { CreateScheduleMeetingDto } from './dto/create-schedule-meeting.dto';
import { UpdateScheduleMeetingDto } from './dto/update-schedule-meeting.dto';
import { ScheduleMeetingsRO } from './interfaces/schedule-meetings.interface';

@Injectable()
export class ScheduleMeetingsService {
  async create(request: CreateScheduleMeetingDto) : Promise<ScheduleMeetingsRO> {
    
  }

  findAll() {
    return `This action returns all scheduleMeetings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduleMeeting`;
  }

  update(id: number, updateScheduleMeetingDto: UpdateScheduleMeetingDto) {
    return `This action updates a #${id} scheduleMeeting`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduleMeeting`;
  }
}
