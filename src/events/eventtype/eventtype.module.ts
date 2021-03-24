import { Module } from '@nestjs/common';
import { EventtypeService } from './eventtype.service';
import { EventtypeController } from './eventtype.controller';

@Module({
  controllers: [EventtypeController],
  providers: [EventtypeService]
})
export class EventtypeModule {}
