import { Module } from '@nestjs/common';
import { ScheduleMeetingsService } from './schedule-meetings.service';
import { ScheduleMeetingsController } from './schedule-meetings.controller';
import { ScheduleMeetingRepository } from './schedule-meeting.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleMeetingRepository]),
  ],
  controllers: [ScheduleMeetingsController],
  providers: [ScheduleMeetingsService]
})
export class ScheduleMeetingsModule {}
