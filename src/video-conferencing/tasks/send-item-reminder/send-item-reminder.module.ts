import { Module } from '@nestjs/common';
import { ScheduleMeetingRepository } from 'src/video-conferencing/schedule-meetings/schedule-meeting.repository';
import { SendMeetingReminderService } from './send-meeting-reminder.service';

@Module({
  providers: [SendMeetingReminderService, ScheduleMeetingRepository],
})
export class SendItemReminderModule {}