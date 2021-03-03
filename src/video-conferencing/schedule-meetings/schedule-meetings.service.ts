import { Injectable } from '@nestjs/common';
import { FilterDto } from 'src/_common/filter.dto';
import { DeleteResult } from 'typeorm';
import { CreateScheduleMeetingDto } from './dto/create-schedule-meeting.dto';
import { UpdateScheduleMeetingDto } from './dto/update-schedule-meeting.dto';
import { ScheduleMeetingsRO } from './interfaces/schedule-meetings.interface';
import { ScheduleMeetingRepository } from './schedule-meeting.repository';

@Injectable()
export class ScheduleMeetingsService {
  
  constructor(private readonly scheduleMeetingsRepo: ScheduleMeetingRepository) {}

  async create(request: CreateScheduleMeetingDto) : Promise<ScheduleMeetingsRO> {
      return await this.scheduleMeetingsRepo.saveMeetingSchedule(request);
  }

  async findAll(queryParam: FilterDto): Promise<ScheduleMeetingsRO[]> {
    return await this.scheduleMeetingsRepo.getAllMeetingsSchedules(queryParam);
  }

  async findOne(id: string) : Promise<ScheduleMeetingsRO>{
    return await this.scheduleMeetingsRepo.findMeetingById(id);
  }

  async update(id: string, updateScheduleMeetingDto: UpdateScheduleMeetingDto) : Promise<ScheduleMeetingsRO> {
    return await this.scheduleMeetingsRepo.updateMeeting(id, updateScheduleMeetingDto);
  }

  async startMeeting(id: string): Promise<ScheduleMeetingsRO> {
    return await this.scheduleMeetingsRepo.startMeeting(id);
  }

  async endMeeting(id: string) : Promise<ScheduleMeetingsRO>{
    return await this.scheduleMeetingsRepo.endMeeting(id);
  }

  async remove(id: string) : Promise<DeleteResult>{
    return await this.scheduleMeetingsRepo.deleteMeeting(id);
  }
}
