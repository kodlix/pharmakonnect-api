import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { EventtypeModule } from './eventtype/eventtype.module';


@Module({
  imports: [EventModule, EventtypeModule]
})
export class EventsModule {}