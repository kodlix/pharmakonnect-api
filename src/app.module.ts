import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
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
import { ScheduleMeetingsModule } from './video-conferencing/schedule-meetings/schedule-meetings.module';
import { FlatMeetingModule } from './video-conferencing/events/flat-meeting-gateway/flat-meeting.module';
import { GroupchatModule } from './groupchat/groupchat.module';
import { OutletModule } from './outlet/outlet.module';
import { StartMeetingReminderModule } from './video-conferencing/tasks/start-meeting-reminder/start-meeting-reminder.module';
import { ScheduleMeetingGatewayModule } from './video-conferencing/events/schedule-meeting-gateway/schedule-meeting-gateway.module';
import { ArticleModule } from './blog/article/article.module';
import { CommentModule } from './blog/comment/comment.module';
import { CategoryModule } from './blog/category/category.module';
import { EventsModule } from './events/events.module';
import { EventReminderModule } from './events/tasks/event-reminder.module';
import { PollModule } from './poll/poll.module';
import { PackageModule } from './package/package.module';
import { FeatureModule } from './features/feature.module';
import { MailerModule } from './mailer/mailer.module';
import { LikeModule } from './user-like/like.module';
import { AdvertModule } from './advert/advert/advert.module';
import { AdvertCategoryModule } from './advert/advertcategory/advertcategory.module';
import { join } from 'path';
import { NotificationModule } from './notifications/notification/notification.module';
import { NotificationtypeModule } from './notifications/notificationtype/notificationtype.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),   // <-- path to the static files
    }),
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
    //ChatModule,
    ContactModule,
    //GroupchatModule,
    OutletModule,
    ScheduleMeetingGatewayModule,
    ScheduleModule.forRoot(),
    StartMeetingReminderModule,
    EventReminderModule,
    ArticleModule,
    CommentModule,
    CategoryModule,
    EventsModule,
    PollModule,
    PackageModule,
    FeatureModule,
    MailerModule,
    LikeModule,
    AdvertModule,
    AdvertCategoryModule,
    NotificationModule,
    NotificationtypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
