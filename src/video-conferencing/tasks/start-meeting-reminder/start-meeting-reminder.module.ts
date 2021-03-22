import { Module } from '@nestjs/common';
import { ScheduleMeetingRepository } from 'src/video-conferencing/schedule-meetings/schedule-meeting.repository';
import { StartMeetingReminderService } from './start-meeting-reminder.service';

@Module({
  providers: [StartMeetingReminderService, ScheduleMeetingRepository],
})
export class StartMeetingReminderModule {}