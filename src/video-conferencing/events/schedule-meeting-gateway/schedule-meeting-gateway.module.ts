import { Module } from '@nestjs/common';
import { ScheduleMeetingRepository } from 'src/video-conferencing/schedule-meetings/schedule-meeting.repository';
import { ScheduleMeetingGateway } from './schedule-meeting.gateway';

@Module({
  providers: [ScheduleMeetingGateway, ScheduleMeetingRepository]
})
export class ScheduleMeetingGatewayModule {}