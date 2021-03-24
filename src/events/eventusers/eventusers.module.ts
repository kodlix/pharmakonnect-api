import { Module } from '@nestjs/common';
import { EventusersService } from './eventusers.service';
import { EventusersController } from './eventusers.controller';

@Module({
  controllers: [EventusersController],
  providers: [EventusersService]
})
export class EventusersModule {}
