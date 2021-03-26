import { Module } from '@nestjs/common';
import { EventRepository } from '../event/event.repository';
import { EventReminderService } from './event-reminder.service';

@Module({
  providers: [EventReminderService, EventRepository],
})
export class EventReminderModule {}