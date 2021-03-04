import { Module } from '@nestjs/common';
import { FlatMeetingGateway } from './flat-meeting.gateway';

@Module({
  providers: [FlatMeetingGateway],
})
export class FlatMeetingModule {}