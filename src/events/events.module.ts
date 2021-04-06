import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { EventTypeModule } from './eventtype/eventtype.module';
import { EventUsersModule } from './eventusers/eventusers.module';
import { EventReminderModule } from './tasks/event-reminder.module';


@Module({
  imports: [EventModule, EventTypeModule, EventUsersModule, EventReminderModule]
})
export class EventsModule {}