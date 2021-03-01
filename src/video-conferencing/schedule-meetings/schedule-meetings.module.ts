import { Module } from '@nestjs/common';
import { ScheduleMeetingsService } from './schedule-meetings.service';
import { ScheduleMeetingsController } from './schedule-meetings.controller';

@Module({
  controllers: [ScheduleMeetingsController],
  providers: [ScheduleMeetingsService]
})
export class ScheduleMeetingsModule {}
