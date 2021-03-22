/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorModule } from './sector/sector.module';
import { CountryModule } from './country/country.module';
import { StateModule } from './state/state.module';
import { JobVacancyModule } from './jobvacancy/jobvacancy.module';
import { LgaModule } from './lga/lga.module';
import { SeederModule } from './seeder/seeder.module';
import { ChatModule } from './chat/chat.module';
import { ContactModule } from './contact/contact.module';
import { GroupchatModule } from './groupchat/groupchat.module';
import { ScheduleMeetingsModule } from './video-conferencing/schedule-meetings/schedule-meetings.module';
import { FlatMeetingModule } from './video-conferencing/events/flat-meeting-gateway/flat-meeting.module';
import { OutletModule } from './outlet/outlet.module';
import { StartMeetingReminderModule } from './video-conferencing/tasks/start-meeting-reminder/start-meeting-reminder.module';
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
    ChatModule,
    ContactModule,
    OutletModule,
    ScheduleMeetingGatewayModule,
    ScheduleModule.forRoot(),
    StartMeetingReminderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
