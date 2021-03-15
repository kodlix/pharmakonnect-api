/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorModule } from './sector/sector.module';
import { CountryModule } from './country/country.module';
import { StateModule } from './state/state.module';
import { JobVacancyModule } from './jobvacancy/jobvacancy.module';
import { LgaModule } from './lga/lga.module';
import { SeederModule } from './seeder/seeder.module';
import { ScheduleMeetingsModule } from './video-conferencing/schedule-meetings/schedule-meetings.module';
import { FlatMeetingModule } from './video-conferencing/events/flat-meeting-gateway/flat-meeting.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SendItemReminderModule } from './video-conferencing/tasks/send-item-reminder/send-item-reminder.module';
import { ScheduleMeetingGatewayModule } from './video-conferencing/events/schedule-meeting-gateway/schedule-meeting-gateway.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AccountModule,
    SectorModule,
    CountryModule,
    StateModule,
    JobVacancyModule,
    LgaModule,
    SeederModule,
    ScheduleMeetingsModule,
    FlatMeetingModule,
    ScheduleMeetingGatewayModule,
    ScheduleModule.forRoot(),
    //SendItemReminderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
