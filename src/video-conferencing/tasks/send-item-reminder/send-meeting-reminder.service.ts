
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression  } from '@nestjs/schedule';
import { ScheduleMeetingRepository } from 'src/video-conferencing/schedule-meetings/schedule-meeting.repository';

@Injectable()
export class SendMeetingReminderService {
  private readonly logger = new Logger(SendMeetingReminderService.name);
  
  constructor(private readonly scheduleMeetingRepo: ScheduleMeetingRepository) {

  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    //this.logger.debug('Called when the current second is 45');
  }
}