import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { FilterDto } from 'src/_common/filter.dto';
import { DeleteResult } from 'typeorm';
import { CreateScheduleMeetingDto } from './dto/create-schedule-meeting.dto';
import { UpdateScheduleMeetingDto } from './dto/update-schedule-meeting.dto';
import { ScheduleMeetingsRO } from './interfaces/schedule-meetings.interface';
import { ScheduleMeetingRepository } from './schedule-meeting.repository';

@Injectable()
export class ScheduleMeetingsService {
  
  constructor(private readonly scheduleMeetingsRepo: ScheduleMeetingRepository) {}

  async create(request: CreateScheduleMeetingDto, user: AccountEntity) : Promise<string> {
      return await this.scheduleMeetingsRepo.saveMeetingSchedule(request, user);
  }

  async findAll(queryParam: FilterDto, user: AccountEntity): Promise<ScheduleMeetingsRO[]> {
    return await this.scheduleMeetingsRepo.getAllMeetingsSchedules(queryParam, user);
  }

  async findOne(id: string) : Promise<ScheduleMeetingsRO>{
    return await this.scheduleMeetingsRepo.findMeetingById(id);
  }

  async update(id: string, updateScheduleMeetingDto: UpdateScheduleMeetingDto, user: AccountEntity) : Promise<string> {
    return await this.scheduleMeetingsRepo.updateMeeting(id, updateScheduleMeetingDto, user);
  }

  async remove(id: string) : Promise<DeleteResult>{
    return await this.scheduleMeetingsRepo.deleteMeeting(id);
  }
}
