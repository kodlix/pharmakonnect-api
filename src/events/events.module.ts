import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { EventtypeModule } from './eventtype/eventtype.module';
import { EventusersModule } from './eventusers/eventusers.module';
import { EventReminderModule } from './tasks/event-reminder.module';


@Module({
  imports: [EventModule, EventtypeModule, EventusersModule, EventReminderModule]
})
export class EventsModule {}