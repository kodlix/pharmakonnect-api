import { Module } from '@nestjs/common';
import { ScheduleMeetingsService } from './schedule-meetings.service';
import { ScheduleMeetingsController } from './schedule-meetings.controller';
import { ScheduleMeetingRepository } from './schedule-meeting.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    AccountModule,
    TypeOrmModule.forFeature([ScheduleMeetingRepository]),
  ],
  controllers: [ScheduleMeetingsController],
  providers: [ScheduleMeetingsService]
})
export class ScheduleMeetingsModule {}
